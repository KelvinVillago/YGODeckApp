import UserType from "./auth"

type DeckType = {
    id:number,
    name:string,
    mainDeck:string,
    sideDeck:string,
    extraDeck:string,
    dateCreated:string,
    user_id:number,
    creator: UserType
}

export default DeckType