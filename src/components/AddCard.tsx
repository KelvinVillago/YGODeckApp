import CardType from "../types/card"
import Button from "react-bootstrap/Button"

type AddCardProps = {
    card: CardType
}

export default function AddCard({ card }: AddCardProps) {
    return (
        <div className="row">
            <div className="col-10">  
                <div className="deck-card text-center">
                    <div>
                        <h3>{card.name}</h3>
                        <h5>By {card.desc}</h5>
                    </div>
                </div>
            </div>
            <div className="col-2">
                <Button className="view-btn" variant='primary'>Add Card</Button>
            </div>
        </div>
    )
}
