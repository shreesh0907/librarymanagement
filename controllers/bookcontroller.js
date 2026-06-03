const {BookModel, UserModel} = require("../models")
const IssuedBook = require("../dto/bookdto")

//Get the book by its ID in the system
 exports.getSingleBookById = async(req,res) => {
 const {id} = req.params;
 const books = await BookModel.findById(id)
 if(!books){
        return res.status(404).json({
        success: false,
        message: "Book not found for the Id"
        })
    }
    res.status(200).json({
        success: true,
        data: books
    })
}

// GET: Get all the issued books and data of the user 
 exports.getIssuedBooks = async (req, res) => {
  const users = await UserModel.find({
    issuedBook: { $exists: true, $ne: null },
  }).populate("issuedBook");

  const issuedBooks = users.map((each) => {
    return new IssuedBook(each);
  });

  if (issuedBooks.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No book has currently been issued",
    });
  }

  res.status(200).json({
    success: true,
    data: issuedBooks,
  });
};

//Delete the book by its Id in the system
 exports.deleteBookById = async(req,res) => {
    const {id} = req.params
    const book = await BookModel.findByIdAndDelete(id)
    if(!book){
    return res.status(404).json({
            success: false,
            message: "Book not Found"
        });
    }
        res.status(200).json({
        success: true,
        message: "Book deleted successfully"
        });
}

//POST: Add a new book to the system
 exports.AddNewBook = async(req,res) => {
    const {data} = req.body;
    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }
    await BookModel.create(data);
        res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: req.body
    });
}

//Get all the list of books in the system 
 exports.getAllBooks = async(req,res) =>  {
    const books = await BookModel.find()
    if(books.length === 0){
       return res.status(404).json({
        success: false,
        message: "Books Not Available in Database"
        })
    }
        res.status(200).json({
        success: true,
        data: books
        })
 }

//PUT: Updating a book by its ID
exports.updateBookById = async(req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide the data to update"
        });
    }
    const updatedBook = await BookModel.findByIdAndUpdate(
        id,
        data,
        {new: true}
    )

    if(!updatedBook){
       return res.status(404).json({
        success: false,
        message: "Book not Found"
        })
    } 
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook
    });
}
