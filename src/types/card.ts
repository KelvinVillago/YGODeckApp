type CardType = {
    id:number,
    name:string,
    type:string,
    desc:string,
    attribute:string,
    race:string,
    card_images:[{
        image_url:string
    }],
    data?:any
}

export default CardType