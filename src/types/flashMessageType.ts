import CategoryType from "./category";

type FlashMessageType = {
    flashMessage: (message:string|null, category: CategoryType|null) => void,
} 

export default FlashMessageType