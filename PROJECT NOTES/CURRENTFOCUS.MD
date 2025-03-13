-All Service: Refine frontend return message, add logging

-Class dependencies
    Users
    Troopers: Users
    Rewards: Troopers
    Cookies: 
    Orders: Troopers
    Documents: Orders

-Calculation

-Premptive order suggestion 

-OCR



-Prio:
    -fetch all data using ownerId: 
        -trooper: viewById, viewAll, viewByOwnerId
        -saleData: viewByTrooperId, viewAll, viewByOwnerId (parent)
        -order: viewByTrooperId, viewByOwnerId, viewAll
        -inventory: viewByOwnerId, viewAll


    -inventory and order interaction
        -orderCreated 
        -> calculate cookieTotal Cost: boxes * boxPrice 
        -> calculate totalCost: add all cookieTotalCost 
        -> calculate boxTotal: add all boxes
        -> change inventory: use varietyId and boxes in order to remove the cookies from both parentInventory and leaderInventory
        -> done with orderCreated

        -updateSaleData
        -> done after order is mark complete
        -> add orderId to orderId array
        -> add totalCost to totalMoneyMade
        -> for each varietyId
            -> add boxes to boxTotal
            -> calculate cookieTotalCost = boxPrice * boxTotal

