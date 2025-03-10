/**
Stand alone data
    User // references: troopers, squads, documents, orders, inventory, booths, parents, ACL
    Cookie: just list of cookie
    Reward: just list of reward
Need ownerId field: 
    trooper 
    squad
    documents
    orders
    inventory
    saleData
 */



const userDataFormat = { // for this, attach a 'role' custom claim to the uid when creating the user
    name: '',
    email: '',
    phone: '',
};

const rewardDataFormat = {
    name: '',
    description: '',
    imageLink: '',
    boxesNeeded: 0,
};

// might need to remove
const cookieDataFormat = {
    variety: '',
    description: '',
    price: '',
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// need ownerId

const trooperDataFormat = {
    troopNumber: '',
    trooperName: '',
    ownerId: '',
    troopLeader:'',
    age: '',
    grade: '',
    shirtSize: '',
    currentBalance: 0.0,
    boxesSold: 0,
    // from here down is not sure
    squad: '',
    currentReward: [],
};

// might not need
const troopDataFormat = {
    troopName: '',
    ownerId: '',
    saleData: [],
};

// archive the order when dateCompleted is not null
const completedOrderDataFormat = {};


// take from inventory (of the trooper) when order made
const orderDataFormat = {
    dateCreated: '',
    trooperId: '',
    trooperName: '',
    ownerId: '', // id of the parent of the trooper
    parentName:'',
    pickupDetails: [{
        receivedBy: '',
        address: '',
        troopNumber: '',
    }, {
        receivedFrom: '',
        troopNumber: '',
    }],
    contact: '',
    financialAgreement: false,
    dateCompleted: '', //Date.now()
    //SU: '',

    orderContent: [{
        cookies: [{
            varietyId: '',
            variety: '',
            boxes: 0,
            boxPrice: 0.0,
            cookieTotalCost: 0.0,
            //cases: 0,
        },],
        totalCost: 0,
        owe: 0,
        boxTotal: 0,
        //totalPackages: 0,
    }],
    paymentType: '',
};

// parent can see sale data for their own trooper, 
// leader can see every trooper saleData
const saleDataformatforTrooper = {
    trooperId: '',
    trooperName: '',
    orderId: [],
    cookieData: [
        {varietyId: '', variety: '', boxTotal: 0, cookieTotalCost: 0.0,},
    ],
    totalMoneyMade: 0.0, 
    totalBoxesSold: 0,
};

// for user (for all their troopers)
// leaderInventory = for every parent in the troop, associate to leader, shared among parents
// parentInventory = only for parent's own troopers
// when order is made, take from inventory of both parent and leader
const parentInventoryDataFormat = {
    ownerId: '',
    owe: 0.0,
    inventory: [{
        varietyId: '',
        variety: '',
        boxes: 0,
        boxPrice: 0.0,
    },],  
};

// when order is made and not in fulfilled, put the missing boxes in needToOrder
const leaderInventoryDataFormat = {
    ownerId: '',
    inventory: [{
        varietyId: '',
        variety: '',
        boxes: 0,
        boxPrice: 0.0,
    },],  

    needToOrder: [{
        varietyId: '',
        variety: '',
        boxes: 0,
        boxPrice: 0.0,
    },],  
};

// not use for now, could be use to allow access to saleData
const ACL = {
    userId: "",
    documentACL:[''], // id of the document
    inventoryACL: [''],// id of the inventory
    orderACL: [''],   // id of the order
    saleDataACL: [''], // id of the saleData
    squadACL:[''], //only for leader
    trooperACL: [''], // id of the trooper
    
    boothACL:[''],  // id of the booth
    parentACL:[''], //only for leader
    
};



module.exports = {
    trooperDataFormat,
    squadDataFormat,
    orderDataFormat,
    saleDataformat,
    userDataFormat,
    rewardDataFormat,
    cookieDataFormat,
    inventoryDataFormat,
    ACL
};