class IssuedBook {
    _id;
    title;
    author;
    genre;
    year;
    issuedto;
    issuedDate;
    returnDate;

constructor(user){
    this._id = user.issuedBook._id
    this.title = user.issuedBook.title
    this.author = user.issuedBook.author
    this.genre = user.issuedBook.genre
    this.year = user.issuedBook.year
    this.issuedto = user.issuedBook.issuedto
    this.issuedDate = user.issuedDate
    this.returnDate = user.returnDate
}
}

module.exports = IssuedBook;
