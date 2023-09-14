# Yu-Gi-Oh Deck Application
Create your own decks using cards from the official Yu-Gi-Oh trading card game. Register or log in to save your decks to a database to access anywhere.

### Databases
Flask application to create database for users and decks. The User database stores first and last names, usernames, and emails. The Deck database stores the name of the deck as well as its main, side, and extra decks.
* https://ygo-deck-editor.onrender.com - The Flask application hosted on Render.com. Having the Flask application hosted online allows for anyone to access the database
* https://github.com/KelvinVillago/YGODeckEditor - Github link to the Flask application. Details the methods for the api and what routes are available.

### API
I primarily used the YGOProDeck API for card information. They have put a lot of work into their API and it can give details on a card's name, description, type, race, attribute, atk, def, and a lot more. 
* https://ygoprodeck.com/api-guide/ - Link to a guide for the YGOProDeck API. This details all the routes for the API as well as what parameters can be used as keys to search the API. I mainly used the API to search for card info by name and ID to get card images and ids to add to the deck database

### Description
This application allows for users to create and log into an account on the app. A logged in user is allowed to create and edit a deck. For editing a deck, the user needs to search a specific card name and it will be added to the deck. The deck display will show a picture of all cards in the main, extra, and side decks. Any user logged in or not is able to view all decks on the app and download the ydk file if needed.

