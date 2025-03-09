/**
Stand alone data
    User // references: troopers, squads, documents, orders, inventory, booths, parents, ACL
    Cookie 
    Reward 
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
    contactDetail: {
        address: null,
        phone: null
    },
};

const rewardDataFormat = {
    name: '',
    description: '',
    rewardPointsNeeded: 0,
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

const trooperDataFormat = {
    name: '',
    ownerId: '',
    squad: '',
    contactDetail: {
        address: null,
        phone: null,
        email: '',
    },
    rewardPoints: 0,
    currentBalance: 0.0,
    currentReward: [],

};

// might not need
const squadDataFormat = {
    squadName: '',
    ownerId: '',
    saleData: [],
};

const orderDataFormat = {
    trooperName: '',
    trooperId: '',
    trooperNumber: '',
    ownerId: '', // id of the parent of the trooper
    dateCreated: '',
    SU: '',
    paymentType:{
        cash: 0,
        credit:0,
    },
    orderContent: [{
        cookies: [{
            variety: "",
            cases: 0,
            packages: 0,
        },],
        totalMoney: 0,
        owe: 0,
        totalPackages: 0,
        totalCases: 0,
    }
    ],
    pickupDetails: [{
        receivedBy: '',
        troopNumber: '',
    }, {
        receivedFrom: '',
        troopNumber: '',
    }],
};

// need to talk to advisor to see what he want
const saleDataformat = {
    ownerId: '',
    orderId: [],
    amountSold: 0
};

// for trooper
const inventoryDataFormat = {
    ownerId: '', // id of the parent of the trooper
    trooperName: '',
    trooperId: '',
    inventory: [{
        variety: '',
        cases: 0,
        packages: 0,
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