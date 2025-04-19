<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<div align="center">

  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![project_license][license-shield]][license-url]

</div>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Thin-Mint-Techies/CookieTrack">
    <img src="public/resources/images/cookietrack_logo.png" alt="Logo" width="500" height="100">
  </a>

<h3 align="center">CookieTrack</h3>

  <p align="center">
    A web application designed to streamline the management and tracking of Girl Scout cookie sales, inventory, and rewards programs.
    <br />
    <br />
    <a href="https://github.com/Thin-Mint-Techies/CookieTrack"><strong>Explore the docs »</strong></a>
    <a href="https://github.com/Thin-Mint-Techies/CookieTrack/functions/README.md"><strong>Backend Docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Thin-Mint-Techies/CookieTrack">View Demo</a>
    &middot;
    <a href="https://github.com/Thin-Mint-Techies/CookieTrack/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/Thin-Mint-Techies/CookieTrack/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details style="cursor: pointer">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://cookietrack-hub.web.app/)

CookieTrack is designed to streamline the management of Girl Scout cookie sales by tracking order
requests, order statuses, cookie inventory, and rewards for girl scouts. This product is intended to
be used primarily by the local Girl Scout troop the sponsor is part of. Other Girl Scout troops can
use CookieTrack by cloning the repo and setting up using the included instructions
provided within the product to create their own instances.The web app enables troop
leaders to configure and manage their respective troops, offering features like user authentication, data
storage, and secure access to resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][Node-url]
* [![Express][Express.js]][Express-url]
* [![Tailwind][TailwindCSS]][Tailwind-url]
* [![Firebase][Firebase]][Firebase-url]
* [![SendGrid][SendGrid]][SendGrid-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Features

#### Multi-Level Access Control
- **Troop Leader/Manager**: Full administrative access to manage inventory, rewards, and troop data
- **Parents**: Limited access to manage their troopers' orders and rewards

#### Inventory Management
- Track troop-level cookie inventory
- Manage parent and individual trooper inventory allocations
- Real-time inventory updates when orders are placed or fulfilled
- Need-to-order tracking system

#### Order Management
- Submit and track cookie orders
- Support for both cash and card payments
- Order status tracking (Not ready for pickup, Ready for pickup, Picked up, Completed)
- Financial agreement and pickup location tracking

#### Reward System
- Leaders can create and manage reward tiers
- Automatic reward unlocking based on sales thresholds
- Multiple choice options for each reward
- Visual reward tracking interface

#### Sales Analytics
- Monthly sales tracking
- Revenue and inventory analytics
- Boxes sold statistics
- Orders completed tracking
- Amount owed calculations

#### User Features
- Dark mode support
- Mobile-responsive design
- Document upload capabilities
- Profile management

#### Technical Stack

- Frontend: HTML, CSS (Tailwind), JavaScript
- Backend: Node.js with Express
- Database: Firebase Firestore
- Authentication: Firebase Auth
- Storage: Firebase Storage
- Hosting: Firebase Hosting

#### Data Flow

1. Leader inventory management
2. Parents place orders for specific troopers
3. Orders are processed from leader inventory
4. Upon pickup, cookies are transferred to parent inventory
5. Parents assign cookies to trooper inventory
6. Sales are tracked and rewards are automatically unlocked

#### Security

- Role-based access control
- Secure authentication
- Data validation and sanitization
- Transaction-based inventory updates

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get set up your own instance, follow the steps of the Prerequisites then move on to Installation.

### Prerequisites

1. Clone the repository
   
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a ".env" file and place it in the functions folder and fill it with this base code:
   ```bash
   NODE_ENV="deployment"
   COOKIETRACK_FIREBASE_TYPE="service_account"
   COOKIETRACK_FIREBASE_PROJECT_ID=""
   COOKIETRACK_FIREBASE_PRIVATE_KEY_ID=""
   COOKIETRACK_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n\n-----END PRIVATE KEY-----\n"
   COOKIETRACK_FIREBASE_CLIENT_EMAIL="firebase-adminsdk-sitvk@{your-project-id}.iam.gserviceaccount.com"
   COOKIETRACK_FIREBASE_CLIENT_ID=""
   COOKIETRACK_FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
   COOKIETRACK_FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
   COOKIETRACK_FIREBASE_AUTH_PROVIDER_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
   COOKIETRACK_FIREBASE_CLIENT_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sitvk%40{your-project-id}.iam.gserviceaccount.com"
   COOKIETRACK_FIREBASE_UNIVERSE_DOMAIN="googleapis.com"
   COOKIETRACK_FIREBASE_DB_URL="https://{your-project-id}-default-rtdb.firebaseio.com/"
   COOKIETRACK_FIREBASE_STORAGE_BUCKET="{your-project-id}.firebasestorage.app"
   COOKIETRACK_FIREBASE_API_KEY=""
   ```

4. Set up Firebase by heading to the [Firebase Console][Firebase-url] and setting up your project.

5. For your project, make sure to setup Firestore, Cloud Storage, Functions, and Hosting.

6. Take the values that are provided about your created project in the Project Settings 
   and fill in the missing values of the ".env" file. Make sure to replace the "{your-project-id}" pieces with your Project ID.

7. In the ".firebasesrc" file in the root directory. Replace the values for "cookietrack" and "default" with your Project ID.

8. Finally, in public/resources/pwa/site.webmanifest, update the "cookietrack-hub" values with your Firebase Project ID. This will link Firebase Hosting.  
  

### Installation
   
1. To see changes on the frontend based on Tailwind edits:
   ```javascript
   //Root directory
   npm run dev
   ```

2. To run the local backend server, first you need to enable local testing. In functions/index.js:
   ```javascript
   //In this section of code, uncomment 'origin:true'
   //And comment out the production origin like so
   app.use(cors({
      // Testing only
      origin: true

      // Production
      /*origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          // Allow requests with no origin (like mobile apps or Postman) or those in the list
          callback(null, true);
        } else {
          // Block other origins
          callback(new Error('Not allowed by CORS'));
        }
      }*/
   }));
   ```

   Then you need to enable the local server by uncommenting this section of code like so:
   ```javascript
   /*FROM HERE IS LOCAL ONLY, USE FOR TESTING*/
   const PORT = process.env.PORT || 5000;
   const initializeFirebase = async () => {
     try {
       // Initialize Firebase 
       if (!admin.apps.length) {
         admin.initializeApp(firebaseConfig);
       }
       console.log('Firebase initialized successfully!');

       // Start the Express server
       app.listen(PORT, '0.0.0.0', () => {
         console.log(`Server is running on PORT: ${PORT}`);
       });
     } catch (error) {
       console.error('Error initializing Firebase:', error);
       process.exit(1); // Exit if Firebase initialization fails
     }

   };
   initializeFirebase();
   ```

3. Now to run the local backend server:
   ```javascript
   //From root: cd functions
   npx nodemon index.js
   ```

4. To run the frontend locally, go to public/utils/apiCall.js:
   ```javascript
   //Switch MAIN_URL from PROD_URL to TEST_URL
   const PROD_URL = "https://api-gknady4m2q-uc.a.run.app";
   const TEST_URL = "http://localhost:5000";
   const MAIN_URL = PROD_URL;
   ```

5. This will be different based on what IDE you use. For vscode, you can install 'Live Server' extension and run it on port 5000. 'Go Live' with this extension and select the page you want to start on.
   
6.  Now you have both the frontend and backend being run locally!

7. To start hosting your own instance, run the following command.
   ```javascript
   //This will deploy both functions and hosting to your account 
   firebase deploy
   ```
   To only deploy one or the other, use --only (hosting|functions). 
   ```javascript
   //Example deploying only hosting
   firebase deploy --only hosting  
   ```  

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Frontend Overview](/documentation/Frontend%20Overview.md)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/Thin-Mint-Techies/CookieTrack/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Thin-Mint-Techies/CookieTrack" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the Apache license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Brandon Faulkner  - faulknerb48@gmail.com

Project Link: [https://github.com/Thin-Mint-Techies/CookieTrack](https://github.com/Thin-Mint-Techies/CookieTrack)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Thin-Mint-Techies/CookieTrack.svg?style=for-the-badge
[contributors-url]: https://github.com/Thin-Mint-Techies/CookieTrack/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Thin-Mint-Techies/CookieTrack.svg?style=for-the-badge
[forks-url]: https://github.com/Thin-Mint-Techies/CookieTrack/network/members
[stars-shield]: https://img.shields.io/github/stars/Thin-Mint-Techies/CookieTrack.svg?style=for-the-badge
[stars-url]: https://github.com/Thin-Mint-Techies/CookieTrack/stargazers
[issues-shield]: https://img.shields.io/github/issues/Thin-Mint-Techies/CookieTrack.svg?style=for-the-badge
[issues-url]: https://github.com/Thin-Mint-Techies/CookieTrack/issues
[license-shield]: https://img.shields.io/github/license/Thin-Mint-Techies/CookieTrack.svg?style=for-the-badge
[license-url]: https://github.com/Thin-Mint-Techies/CookieTrack/blob/master/LICENSE.txt
[product-screenshot]: documentation/demo_screenshot.png
[Node.js]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=#5FA04E
[Node-url]: https://nodejs.org/en
[Express.js]: https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-000000?style=for-the-badge&logo=tailwindcss&logoColor=#06B6D4
[Tailwind-url]: https://tailwindcss.com/
[Firebase]: https://img.shields.io/badge/firebase-000000?style=for-the-badge&logo=firebase&logoColor=#DD2C00
[Firebase-url]: https://firebase.google.com/
[SendGrid]: https://img.shields.io/badge/sendgrid-000000?style=for-the-badge&logo=sendgrid&logoColor=#51A9E3
[SendGrid-url]: https://sendgrid.com/en-us