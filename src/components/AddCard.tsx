import { getCardById } from "../lib/apiWrapper"
import CategoryType from "../types/category";
import CardType from "../types/card";
import { get } from "http";
import { useState, useEffect } from 'react';

type AddCardProps = {
    card:string,
    flashMessage: (message:string, category: CategoryType) => void,
}



export default function AddCard({ card, flashMessage}: AddCardProps) {
    let myCard:CardType|null = null

    // useEffect(() => {
    //     getCard(card)
    // })

    const getCard = async (id:string) => {
        console.log('running')
        const response = await getCardById(id);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            if(response.data){
                myCard = response.data.data[0]
                console.log("My Card: ", myCard)
                if(myCard){
                    console.log(`Card: ${myCard.name}, image=`,myCard.card_images[0].image_url)

                }
            }
        }
    }

    if(card != ''){
        getCard(card)
        return (
            <div className="col-2">  
                <div>
                     <img src={`https://images.ygoprodeck.com/images/cards/${card}.jpg`} className="ygo-card"></img>
                </div>
            </div>
        )
    }
    
}
