1. Streamline every functions, Refine return message to output details in server console, simplify the return message for frontend (Class: Dependent on)
    Users
    Troopers: Users
    Rewards: Troopers
    Cookies
    Orders: Troopers
    Documents: Orders

2. get user orders

3. get total cookie sold from troop
    need to make a util function for calculation

4. get trooper sale data

5. Notification service, send via email or phone (check with frontend)

6. Premptive order suggestion 

7. Historial data???? Need to determine what kind of data to keep a history

8. OCR


Priority: 
    -REFACTOR ALL DATA TO SUPPORT ACL (create and update): should create another collection for ACL
        -
    -orderService rework: order take in parent of trooper as ownerId, 
        -still attach trooper as seller, mark order as complete or on going
    -cookieService = inventoryService
        -amount in stock, name, amount sold this month, edit, delete
    -rewardService: Name, price(boxes sold), picture
    -trooperService: boxes of cookie sold, reward available
    -saleDataService CRUD
    -checkUserOwnership: check for multiple files, might need rework or another approach
    -double check everything for data consistency


