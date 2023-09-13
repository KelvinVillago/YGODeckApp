import axios from 'axios';
import DeckType from '../types/deck';
import UserType from '../types/auth';
import CardType from '../types/card';

const base: string = 'https://ygo-deck-editor.onrender.com/api';
const cardApi:string = 'https://db.ygoprodeck.com/api/v7'
// const base: string = 'http://localhost:8080/api';
const deckEndpoint: string = '/decks';
const userEndpoint: string = '/users';
const tokenEndpoint: string = '/token';
const cardEndpoint = '/cardinfo.php?name='

const apiClientCard = () => axios.create({
    baseURL: cardApi
})

async function getCardByName(name:string): Promise<APIResponse<CardType>> {
    let error;
    let data;
    name = name.replace(' ', '%20')
    try{
        const response = await apiClientCard().get(cardEndpoint + name);
        data = response.data;
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}

const apiClientNoAuth = () => axios.create({
    baseURL: base
})

const apiClientBasicAuth = (username:string, password:string) => axios.create({
    baseURL: base,
    headers: {
        Authorization: 'Basic ' + btoa(`${username}:${password}`)
    }
})

const apiClientTokenAuth = (token:string) => axios.create({
    baseURL: base,
    headers: {
        Authorization: 'Bearer ' + token
    }
})

type APIResponse<T> = {
    error?: string,
    data?: T
}

type TokenType = {
    token: string,
    tokenExpiration: string
}

async function getAllDecks(): Promise<APIResponse<DeckType[]>> {
    let error;
    let data;
    try{
        const response = await apiClientNoAuth().get(deckEndpoint);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.message
        } else {
            error = 'Something went wrong'
        }
    }
    return {error, data}
}

async function register(newUserData:Partial<UserType>): Promise<APIResponse<UserType>> {
    let error;
    let data;
    try {
        const response = await apiClientNoAuth().post(userEndpoint, newUserData)
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return {error, data}
}

async function login(username:string, password:string): Promise<APIResponse<TokenType>> {
    let error;
    let data;
    try{
        const response = await apiClientBasicAuth(username, password).get(tokenEndpoint);
        data = response.data
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return {error, data}
}

async function getMe(token:string): Promise<APIResponse<UserType>> {
    let error;
    let data;
    try{
        const response = await apiClientTokenAuth(token).get(userEndpoint + '/me');
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return {error, data}
}

async function createDeck(token:string, newDeck: Partial<DeckType>): Promise<APIResponse<DeckType>> {
    let error;
    let data;
    try {
        const response = await apiClientTokenAuth(token).post(deckEndpoint, newDeck);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}

async function getDeckById(deckId:string): Promise<APIResponse<DeckType>> {
    let error;
    let data;
    try{
        const response = await apiClientNoAuth().get(deckEndpoint + '/' + deckId);
        data = response.data;
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}

async function editDeckById(token:string, deckId:string|number, editedDeckData:DeckType): Promise<APIResponse<DeckType>>{
    let error;
    let data;
    try {
        const response = await apiClientTokenAuth(token).put(deckEndpoint + '/' + deckId, editedDeckData);
        data = response.data
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}

async function deleteDeckById(token:string, deckId:string|number): Promise<APIResponse<string>>{
    let error;
    let data;
    try {
        const response = await apiClientTokenAuth(token).delete(deckEndpoint + '/' + deckId);
        data = response.data.success
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}

export {
    getAllDecks,
    register,
    login,
    getMe,
    createDeck,
    getDeckById,
    editDeckById,
    deleteDeckById,
    getCardByName
}
