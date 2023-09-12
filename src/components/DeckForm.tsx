import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DeckType from '../types/deck';


type DeckFormProps = {
    handleChange: (e:React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: (e:React.FormEvent) => void,
    newDeck: Partial<DeckType>,
    isLoggedIn: boolean
}

export default function DeckForm({ handleChange, handleSubmit, newDeck, isLoggedIn }: DeckFormProps) {
    return (
        <Form onSubmit={handleSubmit} className='deck-form'>
            <Form.Label>Deck Title</Form.Label>
            <Form.Control name='name' onChange={handleChange} value={newDeck.name} placeholder="Enter Deck Name" />
            {/* <Form.Label>Deck Body</Form.Label> */}
            {/* <Form.Control name='body' as='textarea' onChange={handleChange} value={newDeck.body} placeholder="Enter Deck Body" /> */}
            <Button className='mt-3 w-100 submit-btn' variant='warning' type='submit' disabled={!isLoggedIn}>Create Deck</Button>
        </Form>
    )
}