// Import Node Modules
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
// Import Views
import EditDeck from './views/EditDeck';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
// Import Components
import AlertMessage from './components/AlertMessage';
import Navigation from "./components/Navigation";
// Import Types
import CategoryType from './types/category';
import UserType from './types/auth';
// Import apiWrapper functions
import { getMe } from './lib/apiWrapper';


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState((localStorage.getItem('token') && new Date(localStorage.getItem('tokenExp') as string) > new Date()) || false);
    const [loggedInUser, setLoggedInUser] = useState<UserType|null>(null);

    useEffect(() => {
        if (isLoggedIn){
            getMe(localStorage.getItem('token') as string)
                .then(response => {
                    if (response.data){
                        setLoggedInUser(response.data)
                    }
                })
                .catch(err => console.error(err))
        }
    }, [isLoggedIn])

    // useEffect(() => {
    //     if (isLoggedIn){
    //         const now = new Date()
    //         const exp = new Date(localStorage.getItem('tokenExp') || '');
    //         if (new Date(now.setMinutes(now.getMinutes() + 5)) > exp){
    //             flashMessage('You will be logged out in less than 5 minutes', 'danger');
    //         }
    //         if (new Date() > new Date(exp)){
    //             logUserOut();
    //         }
    //     }
    // })

    const [message, setMessage] = useState<string|null>(null);
    const [category, setCategory] = useState<CategoryType|null>(null);

    const logUserIn = (user:UserType):void => {
        setIsLoggedIn(true);
        setLoggedInUser(user);
        flashMessage(`${user.username} has logged in`, 'success');
    }

    const logUserOut = (): void => {
        setIsLoggedIn(false);
        setLoggedInUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExp');
        flashMessage('You have logged out', 'info');
    }

    const flashMessage = (newMessage:string|null, newCategory:CategoryType|null): void => {
        setMessage(newMessage);
        setCategory(newCategory);
    }

    return (
        <div>
            <Navigation isLoggedIn={isLoggedIn} handleClick={logUserOut} />
            <Container>
                {message && <AlertMessage category={category!} message={message} flashMessage={flashMessage} />}
                <Routes>
                    <Route path='/' element={<Home isLoggedIn={isLoggedIn} user={loggedInUser} flashMessage={flashMessage} />} />
                    <Route path='/login' element={<Login isLoggedIn={isLoggedIn} logUserIn={logUserIn} flashMessage={flashMessage} />} />
                    <Route path='/register' element={<Register logUserIn={logUserIn} flashMessage={flashMessage} />} />
                    <Route path='/decks/:deckId' element={<EditDeck flashMessage={flashMessage} currentUser={loggedInUser} />} />
                </Routes>
            </Container>
        </div>
    )
}
