type AddCardProps = {
    card:string
}

export default function AddCard({ card }: AddCardProps) {
    
    if(card != ''){
        return (
            <div className="col-2">  
                <div>
                     <img src={`/images/pics/${card}.jpg`} className="ygo-card"></img>
                </div>
            </div>
        )
    }
    
}
