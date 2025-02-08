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
    troopers: [
        {
            trooperId: "",
            name: "",
        },
    ], // Array of troopers under user
    documents:[{}], // Array of document under user
    orders:[{}], // Array of orders under user
    parents: [{}], // Only for leaders, array of parent IDs
    squads:[],// Only for leaders and manager
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
    orders:[{}],
    saleData: [{}], // Array of objects containing "cookieNameAndID": "amountSold"
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
    troopers: [
        {
            trooperId: "",
            name: "",
        },
    ], // Array of trooper IDs
    totalSaleData: [] 
};

const orderDataFormat = {
    troopName: '',
    troopNumber: '',
    ownerId:'',
    dateCreated: '',
    SU: '',
    orderContent: [
        {
            type: "",
            cases: 0,
            packages: 0,
        },
        {
            totalMoney: 0,
            owe: 0,
            totalPackages: 0,
            totalCases: 0,
        }
    ],
    pickupDetails:[
        {
            receivedBy: '',
            troopNumber:'',
        },
        {
            receivedFrom: '',
            troopNumber:'',
        }
    ],
    accessId:[],
};

const saleDataformat = {
    accessId:[],
    orderId: [],
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