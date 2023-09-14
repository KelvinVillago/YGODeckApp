type AddCardProps = {
    card:string
}

export default function AddCard({ card }: AddCardProps) {
    
    if(card != ''){
        return (
            <div className="col-2">  
                <div>
                    {card != '' && <img src={`/images/pics/${card}.jpg`} className="ygo-card"></img>}
                </div>
            </div>
        )
    }
    
}
