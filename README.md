# librarymanagement
This is a library management API Backend for the management of users and the books

# Routes and the Endpoints

## /users
GET: Get all the list of users in the system
POST: Create/Register a new user

## /users/{id}
GET: Get a user by their ID
PUT: Updating a user by their ID
DELETE: Deletes a user by their ID (Check if the user still has an issued book) && (Is there any fine or penalty to be connected)

## /users/subscriptiondetails/{id}
GET: Get a user subscription details by their ID
    >> Date of Subscription
    >> Valid till?
    >> Fine if any?

## /books
GET: Get all the list of books in the system
POST: Add a new book to the system

## /books/{id}
GET: Get a book by its ID
PUT: Updating a book by its ID
DELETE: Deletes a book by its ID

## /books/issued
GET: Get all the issued books

## /books/issued/withFine
GET: Get all the issued books with their fine amount

### Subscription Types:
 >> Basic (3 months)
 >> Standard (6 months)
 >> Premium (12 months)

>> If a user misses the renewal date, user should be collected with $100 
>> If a user misses his subscription date, user is expected to pay $100
>> If a user misses both renewal and subscription, then collected amount should be $200
