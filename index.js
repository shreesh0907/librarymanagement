const express = require('express');
const port = 2108
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./globaldatabaseconnection');
connectDB();

const app = express();
app.use(express.json());

const {BookModel, UserModel} = require('./models');

//USER MANAGEMENT == 
const { getSingleUserById, getAllUsers, 
    AddNewUser, updateUserById, 
    deleteUserById, getSubscriptionDetailsById} = require('./controllers/usercontroller');

//GET: Get the list of users
app.get('/users', getAllUsers);

//POST: Create/Register a new user
app.post('/users', AddNewUser);


//GET: Get a user subscription details by their ID
app.get('/users/subscriptiondetails/:id', getSubscriptionDetailsById);

//GET: Get a user by their ID
app.get('/users/:id', getSingleUserById);

//PUT: Update a user by their ID
app.put('/users/:id', updateUserById);   

//DELETE: Delete a user by their ID
app.delete('/users/:id', deleteUserById)

 
//BOOKS MANAGEMENT == 
const {getAllBooks, getSingleBookById, 
    deleteBookById, getIssuedBooks, 
    AddNewBook, updateBookById} = require("./controllers/bookcontroller");

 //GET: Get all the list of books in the system 
    app.get('/books', getAllBooks)

 //GET: Get all the issued books and data of the user 
    app.get('/books/issued', getIssuedBooks);

 //POST: Add a new book to the system
    app.post('/books', AddNewBook);

 //GET: Get a book by its ID
    app.get('/books/:id', getSingleBookById)

 //PUT: Updating a book by its ID
    app.put('/books/:id', updateBookById);

 //DELETE: Deletes a book by its ID
    app.delete('/books/:id', deleteBookById)


//HANDLING INVALID ROUTES == 
app.use((req, res) => {
    res.status(500).send('Not Built Yet: Server Error');
});

app.listen(port, () => {
    console.log(`Library Management System is running on http://localhost:${port}`);
});