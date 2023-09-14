import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import DeckCard from "../components/DeckCard";
import DeckForm from '../components/DeckForm';
import CategoryType from '../types/category';
import DeckType from '../types/deck';
import UserType from '../types/auth';
import { getAllDecks, createDeck } from '../lib/apiWrapper';


type HomeProps = {
    isLoggedIn: boolean,
    user: UserType|null,
    flashMessage: (message:string|null, category: CategoryType|null) => void,
}

export default function Home({ isLoggedIn, user, flashMessage }: HomeProps) {
    
    const [decks, setDecks] = useState<DeckType[]>([]);
    const [newDeck, setNewDeck] = useState<Partial<DeckType>>({id: 1, name: '', mainDeck:'', extraDeck:"", sideDeck:""})
    const [displayForm, setDisplayForm] = useState(false);

    useEffect(() => {
        async function fetchData(){
            const response = await getAllDecks();
            console.log(response);
            if (response.data){
                let decks = response.data
                decks.sort((a, b) => (new Date(a.dateCreated) > new Date(b.dateCreated) ? -1 : 1))
                setDecks(decks);
            }
        }

        fetchData();
    }, [newDeck.id])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewDeck({...newDeck, [event.target.name]: event.target.value})
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // setDecks([...decks, newDeck]);
        const token = localStorage.getItem('token') || ''
        const response = await createDeck(token, newDeck);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            setNewDeck({id: decks.length + 2, name: '', mainDeck:'', extraDeck:"", sideDeck:""});
            flashMessage(`${newDeck.name} has been created`, 'primary');
            setDisplayForm(false);
        }
    }

    return (
        <>
            <p className='text-center title'>Welcome {isLoggedIn ? user?.username : 'Duelist'}</p>
            {isLoggedIn && <Button variant='success' className='submit-btn w-100' onClick={() => setDisplayForm(!displayForm)}>Create New Deck</Button>}
            { displayForm && (
                <DeckForm handleChange={handleInputChange} handleSubmit={handleFormSubmit} newDeck={newDeck} isLoggedIn={isLoggedIn}/>
            )}
            <div className='row mt-5'>
                {decks.map( p => <DeckCard deck={p}  key={p.id} /> )}
            </div>
        </>
    )
}