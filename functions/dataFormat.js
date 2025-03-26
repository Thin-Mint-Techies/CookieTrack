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



const userDataFormat = { 
    // for this, attach a 'role' custom claim to the uid when creating the user
    name: '',
    email: '',
    phone: '',
};

const rewardDataFormat = {
    name: '',
    description: '',
    boxesNeeded: 0,
    downloadUrl: '',
};

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

// also contain trooperInventory
const trooperDataFormat = {
    troopNumber: '',
    trooperName: '',
    parentId: '',
    parentName: '',
    troopLeader:'',
    age: '',
    grade: '',
    shirtSize: '',
    squad: '',
    currentReward: [],
    // start of Inventory
    currentBalance: 0.0,
    //boxesSold: 0, 
    inventory: [
        {varietyId: '',variety: '',boxes: 0,boxPrice: 0.0,}, 
        {owe: 0.0,}
    ],
};

// might not need
const troopDataFormat = {
    troopName: '',
    ownerId: '',
    saleData: [],
};

// archive the order when dateCompleted is not null
const completedOrderDataFormat = {
    // copies of orderDataFormat
};


// 
const orderDataFormat = {
    leaderId: '',
    leaderEmail: '',
    dateCreated: '',
    //ownerId: '', // whoever create the order
    //ownerEmail: '',

    trooperId: '',
    trooperName: '',
    parentName:'', // parent of trooper
    parentEmail:'',
    buyerName:'',
    buyerEmail: '',

    contact: '',
    financialAgreement: false,
    paymentType: 'cash', // only support cash for now, leader input owe manually
    //SU: '',

    //fill: false,
    pickupable: false, //Leader hit a button to make it pickupable
    orderIsCorrect: false,
    dateCompleted: '', //Date.now(), will be complete after owe is paid


    pickupDetails: [{
        receivedBy: '',
        address: '',
        troopNumber: '',
        datePickup: '', //Date.now(),  
    }, {
        receivedFrom: '',
        troopNumber: '',
    }],
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
    
};

const parentInventoryDataFormat = {
    ownerId: '',
    owe: 0.0,
    inventory: [
        { varietyId: '',variety: '',boxes: 0,boxPrice: 0.0,},
    ],  
};

const trooperInventoryDataFormat = {
    ownerId: '',
    owe: 0.0,
    inventory: [
        { varietyId: '',variety: '',boxes: 0,boxPrice: 0.0,},
    ],  
};

// when order is made and not in fulfilled, put the missing boxes in needToOrder
const troopInventoryDataFormat = {
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

const saleDataformatforTrooper = {
    ownerId: '',
    trooperId: '',
    trooperName: '',
    orderId: [], // archived order or order?
    cookieData: [
        {varietyId: '', variety: '', boxPrice: '', boxTotal: 0, cookieTotalCost: 0.0,},
    ],
    totalMoneyMade: 0.0, 
    totalBoxesSold: 0,
    currentBalance: 0.0,
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
    userDataFormat,
    rewardDataFormat,
    cookieDataFormat,
    trooperDataFormat,
    troopDataFormat,
    completedOrderDataFormat,
    orderDataFormat,
    saleDataformatforTrooper,
    parentInventoryDataFormat,
    troopInventoryDataFormat,
    trooperInventoryDataFormat,
    ACL,
};