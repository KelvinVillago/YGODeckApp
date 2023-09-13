import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { getDeckById, editDeckById, deleteDeckById, getCardByName } from '../lib/apiWrapper';
import CategoryType from '../types/category';
import DeckType from '../types/deck';
import UserType from '../types/auth';
import CardType from '../types/card';
import AddCard from '../components/AddCard';

type EditDeckProps = {
    flashMessage: (message:string, category: CategoryType) => void,
    currentUser: UserType|null,
}

export default function EditDeck({ flashMessage, currentUser }: EditDeckProps) {
    const mainDeck = ['Effect Monster', 'Normal Monster', 'Spell Card', 'Trap Card', 'Ritual Monster', 'Ritual Effect Monster', 'Pendulum Normal Monster', 'Pendulum Effect Monster']
    const extraDeck = ['Fusion Monster', 'Synchro Monster', 'XYZ Monster']


    const { deckId } = useParams();
    const navigate = useNavigate();

    const [deckToEdit, setDeckToEdit] = useState<DeckType|null>(null);

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    
    const [showCards, setShowCards] = useState(false);
    const openCards = () => setShowCards(true);
    const closeCards = () => setShowCards(false);


    const [card, setCard] = useState<string>("");
    const [cardRes, setCardRes] = useState<CardType|null>(null);

    const [gotCards, setGotCards] = useState(false)

    const [mainCards, setMainCards] = useState<string[]>(deckToEdit?.mainDeck.split(',') || [])
    const [extraCards, setExtraCards] = useState<string[]>(deckToEdit?.extraDeck.split(',') || [])
    const [sideCards, setSideCards] = useState<string[]>(deckToEdit?.sideDeck.split(',') || [])

    let view:boolean = true

    if(currentUser && deckToEdit){
        view = deckToEdit!.user_id !== currentUser?.id
    }

    useEffect(() => {
        async function getDeck(){
            let response = await getDeckById(deckId!);
            if (response.error){
                flashMessage(response.error, 'danger');
                navigate('/');
            } else {
                setDeckToEdit(response.data!);
            }
        }
        getDeck();
        console.log('Deck: ', deckToEdit)
        if(deckToEdit){
            setMainCards(deckToEdit!.mainDeck.split(','))
            console.log('Main Deck: ', mainCards)
            setExtraCards(deckToEdit!.extraDeck.split(','))
            console.log('Extra Deck: ', extraCards)
            setSideCards(deckToEdit!.sideDeck.split(','))
            console.log('Side Deck: ', sideCards)
        } 
    }, [flashMessage, navigate, deckId])

    useEffect(() => {
        if (deckToEdit){
            if (view){
                flashMessage('You do not have permission to edit this deck. View Only', 'warning');
                // navigate('/')
            }
        }
    })

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setDeckToEdit({...deckToEdit, [e.target.name]: e.target.value} as DeckType)
    }

    const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem('token') || ''
        const response = await editDeckById(token, deckId!, deckToEdit!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(`${response.data?.name} has been updated`, 'success')
            navigate('/')
        }
    }

    const handleDeleteDeck = async () => {
        const token = localStorage.getItem('token') || ''
        const response = await deleteDeckById(token, deckId!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(response.data!, 'primary');
            navigate('/')
        }
    }

    const handleCardInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setCard(e.target.value)
    }

    const handleCardFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGotCards(false)
        const response = await getCardByName(card!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            // flashMessage(`${response.data?.name} has been updated`, 'success')
            // console.log(response.data)
            if(response.data){
                // console.log(typeof response.data)
                setCardRes(response.data)
                console.log('Card: ', cardRes)
                let newDeck:Partial<DeckType> = deckToEdit!
                console.log('Type: ', cardRes?.data[0].type)
                if(mainDeck.includes(cardRes?.data[0].type)){
                    let main = newDeck.mainDeck?.split(',')
                    if(main?.length! < 60){
                        newDeck.mainDeck += cardRes?.data[0].id.toString() + ','
                        flashMessage(`${cardRes?.data[0].name} added to main deck`, 'success')
                        setMainCards(newDeck.mainDeck?.split(',') || [])
                    }
                    else{
                        flashMessage('Your main deck must be less than 60 cards', 'warning')
                        let side = newDeck.sideDeck?.split(',')
                        if(side?.length! < 15){
                            newDeck.mainDeck += cardRes?.data[0].id.toString() + ','
                            flashMessage(`${cardRes?.data[0].name} added to side deck`, 'success')
                            setSideCards(newDeck.sideDeck?.split(',') || [])
                        }
                        else{
                            flashMessage('Your side and main decks are full. Cannot add card', 'warning')
                        }
                    }
                }
                else if(extraDeck.includes(cardRes?.data[0].type)){
                    let extra = newDeck.extraDeck?.split(',')
                    if(extra?.length! < 15){
                        newDeck.extraDeck += cardRes?.data[0].id.toString() + ','
                        flashMessage(`${cardRes?.data[0].name} added to extra deck`, 'success')
                        setExtraCards(newDeck.extraDeck?.split(',') || [])
                    }
                    else{
                        flashMessage('Your extra deck must be less than 15 cards', 'warning')
                    }
                }
                console.log('Deck: ', newDeck)
                const response2 = await editDeckById(localStorage.getItem('token') || '', deckId!, newDeck as DeckType)
                if(response2.error){
                    flashMessage(response2.error, 'danger')
                }
                else{
                    flashMessage(`${deckToEdit?.name}} has been updated`, 'success')
                    console.log(deckToEdit)
                }
            }
        }
    }

    
    const downloadTxtFile = () => {
        const textDownload = [`#created by ${deckToEdit?.creator.username}\n`, '#main\n']
        for(let i of mainCards){
            textDownload.push(i + '\n');
        }
        textDownload.push('#extra\n')
        for(let i of extraCards){
            textDownload.push(i + '\n');
        }
        textDownload.push('!side\n')
        for(let i of sideCards){
            textDownload.push(i + '\n');
        }

        const file = new Blob(textDownload, {type: 'text/plain'})
        
        const element = document.createElement('a')
        element.href = URL.createObjectURL(file)
        element.download = `${deckToEdit?.name}.ydk`

        document.body.appendChild(element);
        element.click();
    }


    return (
        <>
            <h1 className="text-center title">{view ? 'View' : 'Edit'} '{deckToEdit?.name}'</h1>
            {deckToEdit && !view && (
                <div className='row'>
                    <div className='col-8'>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleFormSubmit}>
                                    <Form.Label>Edit Deck Title</Form.Label>
                                    <Form.Control name='name' value={deckToEdit?.name} onChange={handleInputChange} />
                                    <div className='row'>
                                        <p>Deck</p>
                                        {deckToEdit.mainDeck == '' ? <p>There are no cards in the main deck</p> : mainCards.map(( p => <AddCard card={p} /> ))}
                                        {deckToEdit.extraDeck == '' && <p>There are no cards in the extra deck</p>}
                                        {deckToEdit.sideDeck == '' && <p>There are no cards in the side deck</p>}
                                    </div>
                                    {!view && <Button variant='success' className='mt-3 w-50' type='submit'>Done</Button>}
                                    {!view && <Button variant='danger' className='mt-3 w-50' onClick={openModal}>Delete Deck</Button>}
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col-4'>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleCardFormSubmit}>
                                    <Form.Label>Find Card</Form.Label>
                                    <Form.Control name='name' value={card!} onChange={handleCardInputChange} />
                                    <Button variant='success' className='mt-3 w-100' type='submit' onClick={openCards}>Search</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            )}
            {deckToEdit && view && (
                <div className='row'>
                    <div className='col-12'>
                        <Card>
                            <Card.Body>
                                <div className='row'>
                                    <Button id='download-btn' onClick={downloadTxtFile} value={'download'}>
                                        Download File
                                    </Button>
                                </div>
                                <div className='row'>
                                    <p>Main Deck</p>
                                    {mainCards.length ? mainCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the main deck</p>}
                                    
                                    <p>Extra Deck</p>
                                    {extraCards.length ? extraCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the extra deck</p>}

                                    <p>Side Deck</p>
                                    {sideCards.length ? sideCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the side deck</p>}

                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            )}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {deckToEdit?.name}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {deckToEdit?.name}? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="danger" onClick={handleDeleteDeck}>Delete Deck</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}