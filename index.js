const express = require('express');
const users = require('./data/users.json');
const books = require('./data/books.json')
const app = express();
app.use(express.json());
const port = 2108

//USER MANAGEMENT == 
//GET: Get the list of users
app.get('/users', (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    });
});

//GET: Get a user by their ID
app.get('/users/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not Found"
        })
    }
    res.status(200).json({
        success: true,
        data: user
    }); 
});

//POST: Create/Register a new user
app.post('/users', (req, res) => {
    const {id, name, email, subscriptionType, subscriptionDate, issuedBook, issuedDate, returnDate} = req.body;
    if(!id || !name || !email || !subscriptionType || !subscriptionDate){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }
    const user = users.find((each) => each.id === id);
    if(user){
        return res.status(400).json({
            success: false,
            message: "User with this ID already exists"
        });
    }
    users.push(req.body);
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: req.body
    });
});

//PUT: Update a user by their ID
app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
        success: false,
        message: "User not Found"
    })}
    const {name, email, subscriptionType, subscriptionDate, issuedBook, issuedDate, returnDate} = req.body;
    if(name) user.name = name;
    if(email) user.email = email;
    if(subscriptionType) user.subscriptionType = subscriptionType;
    if(subscriptionDate) user.subscriptionDate = subscriptionDate;
    if(issuedBook) user.issuedBook = issuedBook;
    if(issuedDate) user.issuedDate = issuedDate;
    if(returnDate) user.returnDate = returnDate;

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});   

//DELETE: Delete a user by their ID
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    users.splice(users.indexOf(user), 1);
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
})

//GET: Get a user subscription details by their ID
app.get('/users/subscriptiondetails/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const issuedBook = books.find((book) => book.id === user.issuedBook);

    const getDateInDays = (dateString = '') => {
        const date = dateString ? new Date(dateString) : new Date();
        return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    };

    const getSubscriptionExpiration = (subscriptionDate, type) => {
        if (type === "Basic") return subscriptionDate + 90;
        if (type === "Standard") return subscriptionDate + 180;
        if (type === "Premium") return subscriptionDate + 365;
        return subscriptionDate;
    };

    const currentDate = getDateInDays();
    const subscriptionDate = getDateInDays(user.subscriptionDate);
    const subscriptionExpiration = getSubscriptionExpiration(
        subscriptionDate,
        user.subscriptionType
    );

    const returnDateDays = user.returnDate
        ? getDateInDays(user.returnDate)
        : null;
    const isOverdue =
        returnDateDays !== null &&
        returnDateDays < currentDate;
    const fine = isOverdue
        ? (subscriptionExpiration < currentDate ? 200 : 100)
        : 0;

    const data = {
    ...user,
    issuedBookDetails: issuedBook || null,
    subscriptionExpired: subscriptionExpiration < currentDate,
    subscriptionDaysLeft: Math.max(0, subscriptionExpiration - currentDate),
    bookOverdue: isOverdue,
    daysLeftForReturn: returnDateDays !== null ? returnDateDays - currentDate : null, fine};

    res.status(200).json({
        success: true,
        data
    });
});

//BOOKS MANAGEMENT ==
    //GET: Get all the list of books in the system 
    app.get('/books', (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    })
})

    // GET: Get all the issued books and data of the user 
    app.get('/books/issued', (req, res) => {
    const issuedBooks = books.filter(book => book.issued).map(book => {
    const user = users.find(
    user => user.issuedBook === book.id);
    return {book, issuedTo: user || null};
});
    res.status(200).json({
        success: true,
        count: issuedBooks.length,
        data: issuedBooks
});
});

    // GET: Get a book by its ID
    app.get('/books/:id', (req,res)=>{
    const {id} = req.params;
    const book = books.find((each)=> each.id === Number(id))
    if(!book){
        return res.status(404).json({
        success: false,
        message: "Book is not in stock"
        })
    }
    res.status(200).json({
        success: true,
        data: book
    })
    })

    //POST: Add a new book to the system
    app.post('/books', (req,res) => {
    const {id, title, author, genre, year, issued} = req.body;
    if(!id || !title || !author || !genre || !year){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }
    if(books.find((each) => each.id === id)){
        return res.status(400).json({
            success: false,
            message: "Book with this ID already exists"
        });
    }
    books.push(req.body);
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: req.body
    });
    });

    //PUT: Updating a book by its ID
    app.put('/books/:id', (req, res) => {
    const {id} = req.params;
    const book = books.find((each) => each.id === Number(id));
    if(!book){
        return res.status(404).json({
        success: false,
        message: "Book not Found"
    })}
    const {title, author, genre, year, issued} = req.body;
    if(title) book.title = title;
    if(author) book.author = author;
    if(genre) book.genre = genre;
    if(year) book.year = year;
    if(issued !== undefined) book.issued = issued;
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book
    });
    });

    //DELETE: Deletes a book by its ID
    app.delete('/books/:id', (req,res) => {
    const {id} = req.params
    const book = books.find((each) => each.id === Number(id));
    if(!book){
        return res.status(404).json({
            success: false,
            message: "Book not Found"
        });
    }
    books.splice(books.indexOf(book), 1);
    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    });
    })


//HANDLING INVALID ROUTES == 
app.use((req, res) => {
    res.status(500).send('Not Built Yet: Server Error');
});

app.listen(port, () => {
    console.log(`Library Management System is running on http://localhost:${port}`);
});