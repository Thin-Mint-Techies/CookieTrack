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







ORDER
Create order: POST http://localhost:5000/order
{
  "trooperName": "Jane Doe",
  "trooperId": "trooper123",
  "ownerId": "owner123",
  "ownerEmail": "owner@example.com",
  "buyerEmail": "buyer@example.com",
  "parentName": "Parent Doe",
  "contact": "555-555-5555",
  "financialAgreement": true,
  "orderContent": {
    "cookies": [
      {
        "varietyId": "variety123",
        "variety": "Thin Mints",
        "boxes": 10,
        "boxPrice": 5.00
      }
    ],
    "totalCost": 50.00,
    "boxTotal": 10
  },
  "paymentType": "cash"
}

Mark order complete: PUT http://localhost:5000/orderComplete/:id
{
  "pickupDetails": {
    "receivedBy": "Jane Doe",
    "address": "123 Elm Street",
    "troopNumber": "123",
    "datePickup": "2025-03-21T10:00:00Z"
  }
}

Parent pickup: PUT http://localhost:5000/orderPickup/:id
{
  "parentEmail": "parent@example.com"
}





INVENTORY
Create parent inventory: POST http://localhost:5000/parentInventory
{
  "ownerId": "owner123",
  "trooperId": "trooper123",
  "trooperName": "Jane Doe",
  "trooperNumber": "123",
  "inventory": [
    {
      "varietyId": "variety123",
      "variety": "Thin Mints",
      "boxes": 100,
      "boxPrice": 5.00
    }
  ]
}

Create trooper inventory: POST http://localhost:5000/trooperInventory
{
  "parentId": "parent123",
  "trooperId": "trooper123",
  "trooperName": "Jane Doe",
  "trooperNumber": "123",
  "inventory": [
    {
      "varietyId": "variety123",
      "variety": "Thin Mints",
      "boxes": 50,
      "boxPrice": 5.00
    }
  ]
}




SALE DATA
Create sale data: POST http://localhost:5000/saleData
{
  "trooperId": "trooper123",
  "trooperName": "Jane Doe",
  "orderId": ["order123"],
  "cookieData": [
    {
      "varietyId": "variety123",
      "variety": "Thin Mints",
      "boxPrice": 5.00,
      "boxTotal": 10,
      "cookieTotalCost": 50.00
    }
  ],
  "totalMoneyMade": 50.00,
  "totalBoxesSold": 10
}