USER

Create user: POST http://localhost:5000/user
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "role": "parent",
  "contactDetail": {
    "address": "123 Elm Street",
    "phone": "555-555-5555"
  }
}


Get all user: GET http://localhost:5000/user

Update user: UPDATE http://localhost:5000/user/id

Delete user by id: DELETE http://localhost:5000/user/id

COOKIE
Create cookie: POST http://localhost:5000/cookie
{
  "name": "Thin Mints",
  "type": "Chocolate",
  "description": "Delicious chocolate mint cookies",
  "price": 5.00
}

Get all cookie: GET http://localhost:5000/cookie


TROOPER
Create troop: POST http://localhost:5000/user/troop
{
  "name": "Troop 123",
  "email": "troop123@example.com",
  "assignedParent": "",
  "contactDetail": {
    "address": "123 Elm Street",
    "phone": "555-555-5555"
  },
  "saleData":[]
}