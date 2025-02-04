/**
Stand alone data
    User
    Cookie
    Reward
Need accessId field
    trooper
    squad
    documents
    orders
 */


const userDataFormat = { // for this, attach a 'role' custom claim to the uid when creating the user
    name: '',
    email: '',
    contactDetail: {
        address: null,
        phone: null
    },
    trooperIds: [], // Array of trooper IDs
    parents: [] // Only for leaders, array of parent IDs
};

const rewardDataFormat = {
    name: '',
    description: '',
    rewardPointsNeeded: 0,
};

const cookieDataFormat = {
    name: '',
    description: '',
    price: '',
};

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// need accessId array for each

const trooperDataFormat = {
    name: '',
    email: '',
    assignedParent: '',
    accessId: [], // Array of access IDs
    saleData: [], // Array of objects containing "cookieNameAndID": "amountSold"
    contactDetail: {
        address: null,
        phone: null
    },
    rewardPoints: 0,
    currentReward: null // Optional field, can be null
};

const squadDataFormat = {
    squadName: '',
    creatorId: '',
    accessId: [], // Array of access IDs
    troopersId: [], // Array of trooper IDs
    totalSaleData: [] // Array of objects containing "cookieNameAndID": "amountSold"
};

const orderDataFormat = {
    buyer: '',
    seller: '',
    accessId:[],
    descriptions: [], // address, delivery, etc...
    totalPayment: 0,
    amountOfCookies: 0,
    cookies: [] // Array of objects containing "cookieNameAndID": "amountSold"
};

const saleDataformat = {
    accessId:[],
    cookieNameAndID: [],
    amountSold: 0
};


module.exports = {
    trooperDataFormat,
    squadDataFormat,
    orderDataFormat,
    saleDataformat,
    userDataFormat,
    rewardDataFormat,
    cookieDataFormat
};