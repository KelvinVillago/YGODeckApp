type AddCardProps = {
    card:string
}



export default function AddCard({ card}: AddCardProps) {

    if(card != ''){
        return (
            <div className="col-2">  
                <div>
                     <img src={`https://images.ygoprodeck.com/images/cards/${card}.jpg`} className="ygo-card"></img>
                </div>
            </div>
        )
    }
    
}
