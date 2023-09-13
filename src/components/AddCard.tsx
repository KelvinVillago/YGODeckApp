type AddCardProps = {
    card:string
}

export default function AddCard({ card }: AddCardProps) {
    return (
        <div className="col-2">  
            <div>
                {card != '' && <img src={`/images/pics/${card}.jpg`}></img>}
            </div>
        </div>
    )
}
