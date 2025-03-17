-All Service: Refine frontend return message, add logging

-Optimization options: 
    -Batch Reads: Combine multiple read requests into a single batch read request.
    -Caching: Use caching to store frequently accessed data and reduce the number of reads to the database.
    -Pagination: Implement pagination to limit the number of documents read in a single request.
    -Denormalization: Store redundant data to reduce the number of reads needed to fetch related data.

-Premptive order suggestion (can leave this for frontend)

-OCR (might not have time)

-Testing: all routes and services

-Booth implementation

-Reward pictures

-User profile picture



-Prio:
    -inventory and order interaction
        -orderCreated 
        -> calculate cookieTotal Cost: boxes * boxPrice 
        -> calculate totalCost: add all cookieTotalCost 
        -> calculate boxTotal: add all boxes
        -> change inventory: use varietyId and boxes in order to remove the cookies from both parentInventory and leaderInventory
            -> If not enough cookie, send email to both parent and leader
            -> update the leader needToOrder field (missing cookies)
        -> done with orderCreated

        -updateSaleData
        -> done after order is mark complete
        -> add orderId to orderId array
        -> add totalCost to totalMoneyMade
        -> for each varietyId
            -> add boxes to boxTotal
            -> calculate cookieTotalCost = boxPrice * boxTotal

