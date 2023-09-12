import UserType from "./auth"

type DeckType = {
    id:number,
    name:string,
    mainDeck:string,
    sideDeck:string,
    extraDeck:string,
    dateCreated:string,
    user_id:number,
    author: UserType
}

export default DeckType