import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { getDeckById, editDeckById, deleteDeckById } from '../lib/apiWrapper';
import CategoryType from '../types/category';
import DeckType from '../types/deck';
import UserType from '../types/auth';

type EditDeckProps = {
    flashMessage: (message:string, category: CategoryType) => void,
    currentUser: UserType|null,
}

export default function EditDeck({ flashMessage, currentUser }: EditDeckProps) {
    const { deckId } = useParams();
    const navigate = useNavigate();

    const [deckToEdit, setDeckToEdit] = useState<DeckType|null>(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

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
        console.log(deckToEdit)
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

    return (
        <>
            <h1 className="text-center">Edit {deckToEdit?.name}</h1>
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
                                        {deckToEdit.mainDeck == '' && <p>There are no cards in the main deck</p>}
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
                            <Form onSubmit={handleFormSubmit}>
                                    <Form.Label>Edit Deck Title</Form.Label>
                                    <Form.Control name='name' value={deckToEdit?.name} onChange={handleInputChange} />

                                    <Button variant='success' className='mt-3 w-100' type='submit'>Search</Button>
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
                                    <p>Deck</p>
                                    {deckToEdit.mainDeck == '' && <p>There are no cards in the main deck</p>}
                                    {deckToEdit.extraDeck == '' && <p>There are no cards in the extra deck</p>}
                                    {deckToEdit.sideDeck == '' && <p>There are no cards in the side deck</p>}
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