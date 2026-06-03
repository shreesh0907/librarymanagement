const {BookModel, UserModel} = require("../models")


//Get the user by its ID in the system
 exports.getSingleUserById = async(req,res) => {
 const {id} = req.params;
 const user = await UserModel.findById(id)
 if(!user){
        return res.status(404).json({
        success: false,
        message: "User not found for the Id"
        })
    }
    res.status(200).json({
        success: true,
        data: user
    })
}

//Get all the list of users in the system 
 exports.getAllUsers = async(req,res) =>  {
    const users = await UserModel.find()
    if(users.length === 0){
       return res.status(404).json({
        success: false,
        message: "Users Not Available in Database"
        })
    }
        res.status(200).json({
        success: true,
        data: users
        })
}

//POST: Add a new user to the system
 exports.AddNewUser = async(req,res) => {
    const {data} = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }

    if (data.issuedBook) {
    const book = await BookModel.findOne({
      title: data.issuedBook,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    data.issuedBook = book._id;
    data.returnDate = data.returnDate || null;

    book.issued = true;
    await book.save();}
    await UserModel.create(data);
        res.status(201).json({
        success: true,
        message: "User added successfully",
        data: req.body
    });
}

//PUT: Updating a user by their ID
exports.updateUserById = async(req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide the data to update"
        });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        data,
        {new: true}
    )

    if(!updatedUser){
       return res.status(404).json({
        success: false,
        message: "User not Found"
        })
    } 
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
}

//DELETE: Delete the user by their Id in the system
 exports.deleteUserById = async(req,res) => {
    const {id} = req.params
    const user = await UserModel.findByIdAndDelete(id)
    if(!user){
    return res.status(404).json({
            success: false,
            message: "User not Found"
        });
    }
        res.status(200).json({
        success: true,
        message: "User deleted successfully"
        });
}

//GET: Get a user subscription details by their ID
exports.getSubscriptionDetailsById = async(req,res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
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
user,
issuedBookDetails: user.issuedBook || null,
subscriptionExpired: subscriptionExpiration < currentDate,
subscriptionDaysLeft: Math.max(0, subscriptionExpiration - currentDate),
bookOverdue: isOverdue,
daysLeftForReturn:
returnDateDays !== null ? returnDateDays - currentDate : null,
fine,
};

    res.status(200).json({
        success: true,
        data
    });
}
