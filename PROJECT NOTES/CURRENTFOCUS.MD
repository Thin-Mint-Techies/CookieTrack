- Data
	- Trooper inventory: contain assigned cookies
	- Parent inventory: contain orders cookies -> assign cookies to troopers
	- Leader inventory: contain the initial cookies

- Data Flow
    - Leader inventory -> Parent place orders -> Take the cookies from the leader inventory -> Cookies goes into the order -> Leader confirm order is picked up -> Cookies from order now in parent inventory -> assign cookie to trooper inventory -> take cookie from parent -> cookie goes into trooper inventory
        - If the order is cancel, the cookies go back to leader inventory
    - Owe is calculated from orders

New Flow: 
    Parent place order for 1 trooper at 1 time -> pickup order -> order goes into trooper inventory and parent inventory -> when owe ammount is zero, mark order as complete -> 



Remaining functions:
    Check for negative in order, check for negagative in other functions.
    Parent returning cookies.
    saleDataService finalization.

Remaining work
    Check login and roles
    check cors
    wait for Brandon to update saledata
    ready to be push to cloud