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

    


-Function
    - Parent select cookies from leader inventory
    - Leader pull all order data in a range
    - Leader add cookies to troop inventory
    - Leader can see trooper balance and inventory
    - Parent can return cookies (orders in reverse)
    - Parent can see their inventory and the troop inventory, how much they owe

    - Parent submit order
        - instock:
            - calculate cookieTotal Cost: boxes * boxPrice 
            - calculate totalCost: add all cookieTotalCost 
            - calculate boxTotal: add all boxes
            - use varietyId and boxes in order to remove the cookies from leaderInventory
            - Get Email confirmation, parent and leader (order submitted)
        - not in stock: 
            -set order to leader's order pile
            - send email to parent and leader
   
    - Leader pull all order marked as unfill (pull the cookie out of leader inventory? )
        - Group based on user
        - System indicate which one is unfill
        - Fill the order individually
            - Parent notify that order is ready to be pickup

    - Parent pickup
        - Leader hit "picked up" button, parent receive notification and confirm order
        - marked the order as pickedup
        - show the parent inventory and how much they owe

    - Parent update trooper inventory with sales
        - Cash: leader update the parent order with the ammount
            - Parent get email notification
        - Credit: automatically update the order 

    -updateSaleData
        -> done after order is mark complete (after all owe is 0)
        -> add orderId to orderId array
        -> add totalCost to totalMoneyMade
        -> for each varietyId
            -> add boxes to boxTotal
            -> calculate cookieTotalCost = boxPrice * boxTotal
    


- Data
	- Trooper inventory: contain assigned cookies
	- Parent inventory: contain orders cookies -> assign cookies to troopers
	- Leader inventory: contain the initial cookies

- Data Flow
    - Leader inventory -> Parent place orders -> Take the cookies from the leader inventory -> Cookies goes into the order -> Leader confirm order is picked up -> Cookies from order now in parent inventory -> assign cookie to trooper inventory -> take cookie from parent -> cookie goes into trooper inventory
        - If the order is cancel, the cookies go back to leader inventory
    - Owe is calculated from orders
    - 




System testing: start with order
Make sure order is working
    Create order: parent inv not updating
Parent return cookies
Make sure that the numeric cannot be negative

