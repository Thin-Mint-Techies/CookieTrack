GET
https://api-gknady4m2q-uc.a.run.app/user
https://api-gknady4m2q-uc.a.run.app/cookie
https://api-gknady4m2q-uc.a.run.app/order
https://api-gknady4m2q-uc.a.run.app/troops
https://api-gknady4m2q-uc.a.run.app/reward


POST (same url but with body, check services folder for more details)

https://api-gknady4m2q-uc.a.run.app/cookie
{
  "name": "Cookie test cloud function 1",
  "description": "Troop test cloud function 1",
  "price": "",
  "monthlySold": [0,0,0,0,0,0,0,0,0,0,0,0]
}

https://api-gknady4m2q-uc.a.run.app/order
{
    "buyer":"",
    "trooperSeller":"",
    "descriptions": "",
    "totalPayment":"",
    "amountOfCookies":"",
}

https://api-gknady4m2q-uc.a.run.app/reward
{
    "name": "",
    "description":"",
}

https://api-gknady4m2q-uc.a.run.app/troop
{
      "name":,
      "email":,
      "assignedParent": , //need to be id
      "contactDetail": {
        "address": "",
        "phone": "",
      },
}

https://api-gknady4m2q-uc.a.run.app/user
{
    "name": "",
    "email": "",
    "role": "", 
    "trooperIds": "",
    "contactDetail": {
        "address": "",
        "phone": "",
    },
}

PUT

DELETE