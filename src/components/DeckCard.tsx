// import Card from 'react-bootstrap/Card';
import DeckType from "../types/deck"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"


type DeckCardProps = {
    deck: DeckType
}

export default function DeckCard({ deck }: DeckCardProps) {
    return (
        <div className="col-6">  
            <div className="deck-card text-center">
                <div>
                    <h3>{deck.name}</h3>
                    <h5>By {deck.creator.username}</h5>
                    <Link  to={`/decks/${deck.id}`}>
                        <Button className="view-btn" variant='primary'>View Deck</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
