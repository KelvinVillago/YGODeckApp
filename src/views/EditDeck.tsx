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
import AddCard from '../components/AddCard';

type EditDeckProps = {
    flashMessage: (message:string, category: CategoryType) => void,
    currentUser: UserType|null,
}

export default function EditDeck({ flashMessage, currentUser }: EditDeckProps) {
    const mainDeck = ['Effect Monster', 'Normal Monster', 'Spell Card', 'Trap Card', 'Ritual Monster', 'Ritual Effect Monster', 'Pendulum Normal Monster', 'Pendulum Effect Monster']
    const extraDeck = ['Fusion Monster', 'Synchro Monster', 'XYZ Monster', 'Link Monster']

    const { deckId } = useParams();
    const navigate = useNavigate();

    const [deckToEdit, setDeckToEdit] = useState<DeckType|null>(null);

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [card, setCard] = useState<string>("");

    const [mainCards, setMainCards] = useState<string[]>([])
    const [extraCards, setExtraCards] = useState<string[]>([])
    const [sideCards, setSideCards] = useState<string[]>([])

    let view:boolean = true

    useEffect(() => {
        console.log('running effect 1')
        async function getDeck(){
            let response = await getDeckById(deckId!);
            if (response.error){
                flashMessage(response.error, 'danger');
                navigate('/');
            } else {
                setDeckToEdit(response.data!);
                if(response.data){
                    setMainCards(response.data!.mainDeck.split(','))
                    console.log('Main Deck: ', mainCards)
                    setExtraCards(response.data!.extraDeck.split(','))
                    console.log('Extra Deck: ', extraCards)
                    setSideCards(response.data!.sideDeck.split(','))
                    console.log('Side Deck: ', sideCards)

                }
            }
        }
        getDeck();
        
    }, [flashMessage, navigate, deckId])

    if(currentUser && deckToEdit){
        view = deckToEdit!.user_id !== currentUser?.id
    }

    useEffect(() => {
        if (deckToEdit){
            if (view){
                flashMessage('You do not have permission to edit this deck. View Only', 'warning');
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
        setCard(e.target.value)
        console.log(e.target.value)
    }

    const handleCardFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await getCardByName(card!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } 
        else {
            if(response.data){
                let cardResponse = response.data
                console.log('Card: ', response.data)
                let newDeck:Partial<DeckType> = {...deckToEdit!}
                if(mainDeck.includes(cardResponse.data[0].type)){
                    if(mainCards.length! < 60){
                        flashMessage(`${cardResponse.data[0].name} added to main deck`, 'success')
                        newDeck.mainDeck = [...mainCards, cardResponse.data[0].id.toString()].toString()
                    }
                    else{
                        flashMessage('Your main deck must be less than 60 cards', 'warning')
                        let side = newDeck.sideDeck?.split(',')
                        if(side?.length! < 15){
                            flashMessage(`${cardResponse.data[0].name} added to side deck`, 'success')
                            newDeck.sideDeck = [...sideCards, cardResponse.data[0].id.toString()].toString()
                        }
                        else{
                            flashMessage('Your side and main decks are full. Cannot add card', 'warning')
                        }
                    }
                }
                else if(extraDeck.includes(cardResponse.data[0].type)){
                    let extra = newDeck.extraDeck?.split(',')
                    if(extra?.length! < 15){
                        flashMessage(`${cardResponse.data[0].name} added to extra deck`, 'success')
                        newDeck.extraDeck = [...extraCards, cardResponse.data[0].id.toString()].toString()
                    }
                    else{
                        flashMessage('Your extra deck must be less than 15 cards', 'warning')
                    }
                }
                console.log("Edit: ", newDeck)
                const response2 = await editDeckById(localStorage.getItem('token') || '', deckId!, newDeck as DeckType)
                if(response2.error){
                    flashMessage(response2.error, 'danger')
                }
                else{
                    flashMessage(`${deckToEdit?.name} has been updated`, 'success')
                }
            }
        }
        setCard("")
    }

    const deleteCards = async () => {
        const response = await getCardByName(card!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            if(response.data){
                let cardResponse = response.data
                console.log('Card: ', response.data)
                let newDeck:Partial<DeckType> = {...deckToEdit!}
                let cardId = cardResponse.data[0].id.toString()
                let mainDeck = newDeck.mainDeck?.split(',');
                let sideDeck = newDeck.mainDeck?.split(',');
                let extraDeck = newDeck.mainDeck?.split(',');

                if(mainDeck?.includes(cardId)){
                    // filter out id of card
                    const ind = mainDeck.indexOf(cardId, 0)
                    mainDeck.splice(ind, 1)

                    // set main again
                    newDeck.mainDeck = mainDeck.toString()
                    flashMessage(`${cardResponse.data[0].name} has been removed from main deck`, 'warning')
                }
                else if(sideDeck?.includes(cardId)){
                    // filter out id of card
                    const ind = sideDeck.indexOf(cardId, 0)
                    sideDeck.splice(ind, 1)

                    // set main again
                    newDeck.sideDeck = sideDeck.toString()
                    flashMessage(`${cardResponse.data[0].name} has been removed from main deck`, 'warning')
                }
                else if(extraDeck?.includes(cardId)){
                    // filter out id of card
                    const ind = extraDeck.indexOf(cardId, 0)
                    extraDeck.splice(ind, 1)

                    // set main again
                    newDeck.extraDeck = extraDeck.toString()
                    flashMessage(`${cardResponse.data[0].name} has been removed from main deck`, 'warning')

                }
                const response2 = await editDeckById(localStorage.getItem('token') || '', deckId!, newDeck as DeckType)
                if(response2.error){
                    flashMessage(response2.error, 'danger')
                }
                else{
                    flashMessage(`${deckToEdit?.name} has been updated`, 'success')
                }
            }
        }
        setCard("")
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
                    <div className='col-8 editor'>
                        <Card className='deck'>
                            <Card.Body>
                                <Form onSubmit={handleFormSubmit}>
                                    <div className='row'>
                                        <Button className="view-btn" id='download-btn' onClick={downloadTxtFile} value={'download'}>
                                            Download File
                                        </Button>
                                    </div>
                                    <Form.Label className='mt-5'>Edit Deck Title</Form.Label>
                                    <Form.Control name='name' value={deckToEdit?.name} onChange={handleInputChange} className='user-form-input'/>
                                    
                                    <div className='row'>
                                        <p className='label'>Main Deck</p>
                                        {mainCards.length ? mainCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the main deck</p>}
                                        
                                        <p className='label'>Extra Deck</p>
                                        {extraCards.length ? extraCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the extra deck</p>}

                                        <p className='label'>Side Deck</p>
                                        {sideCards.length > 0? sideCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the side deck</p>}

                                    </div>
                                    {!view && <Button className='mt-3 w-50 submit-btn' type='submit'>Done</Button>}
                                    {!view && <Button className='delete-btn mt-3 w-50' onClick={openModal}>Delete Deck</Button>}
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col-4 editor'>
                        <Card className='deck'>
                            <Card.Body>
                                <Form onSubmit={handleCardFormSubmit}>
                                    <Form.Label>Find Card</Form.Label>
                                    <Form.Control name='name' value={card!} onChange={handleCardInputChange} className='user-form-input'/>
                                    <Button className='mt-3 w-50 submit-btn' type='submit'>Search</Button>
                                    <Button className='delete-btn mt-3 w-50' type='button' onClick={deleteCards}>Delete</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            )}
            {deckToEdit && view && (
                <div className='row'>
                    <div className='col-12 editor'>
                        <Card className='deck'>
                            <Card.Body>
                                <div className='row'>
                                    <Button className="view-btn" id='download-btn' onClick={downloadTxtFile} value={'download'}>
                                        Download File
                                    </Button>
                                </div>
                                <div className='row'>
                                    <p className='label'>Main Deck</p>
                                    {mainCards.length ? mainCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the main deck</p>}
                                    
                                    <p className='label'>Extra Deck</p>
                                    {extraCards.length ? extraCards.map(( (p,i) => <AddCard card={p} key={i}/> )) : <p>There are no cards in the extra deck</p>}

                                    <p className='label'>Side Deck</p>
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