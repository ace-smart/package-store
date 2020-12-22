# Introduction
The project is a web application for an e-commerce store where business owners can run their business online. It contains two separate servers:
- API Server: Providing number of features and interacting with database. For authentication, it use jsonwebtoken.
- APP Server: Working as a 'middle-man' between clients, administrators and API Server.
Overall, the project is built to work like a mircroservices, each one has a specific role in the general system.

# Features
For the API Server:
- Restful API.
- Use Jsonwebtoken for authentication
- Use nodemailer for sending email.

For the APP Server:
- Login with third party (Facebook, Google, Github)
- Pay with stripe
- Using Axios for calling API


# Installation
Due to being two distinct servers , they have to be set up with different PORTS or located in different places.

## API Server

1. Dependencies
``` JSON
"dependencies": {
  "bcrypt": "^5.0.0",
  "body-parser": "^1.19.0",
  "connect-mongo": "^3.2.0",
  "dotenv": "^8.2.0",
  "express": "^4.17.1",
  "express-flash": "0.0.2",
  "jsonwebtoken": "^8.5.1",
  "mongoose": "^5.9.26",
  "multer": "^1.4.2",
  "nodemailer": "^6.4.14",
  "validator": "^13.1.1"
}
```
Run command below to install those packages:
``` Shell
npm install
```

2. Make sure the folder where API Server is placed have these folder at the same level below
```
- config/
  - multer.js
- controllers/
- email_templates/
- errors/
- helper/
- models/
- node_modules/
- objects/
- routes/
- api_server.js
- db.js
```

3. Declare these enviroment variables
```
# DATABASE URI
API_MONGO_URI
# SENDING EMAIL
API_EMAIL_USER
API_EMAIL_PASS
# URL
API_BASE_URL
# TOKEN FOR JSONWEBTOKEN
ACCESSTOKEN_SECRET
REFRESHTOKEN_SECRET
# APP SERVER
SERVER_PROTOCOL = 'http://'
SEVER_DOMAIN_NAME 
```
4. Status code
Some HTTP code is applied in the project for transparent
- 200: Succeed
- 201: Created
- 204: Updated or removed.
- 400: Bad request (Invalidation error)
- 401: Not authenticated 
- 403: Forbidden
- 404: Not found
- 500: Server error

## APP SERVER

1. Dependencies
``` JSON
"dependencies": {
  "axios": "^0.20.0",
  "body-parser": "^1.19.0",
  "cookie-parser": "^1.4.5",
  "csurf": "^1.11.0",
  "dotenv": "^8.2.0",
  "express": "^4.17.1",
  "express-flash": "0.0.2",
  "express-handlebars": "^5.1.0",
  "express-session": "^1.17.1",
  "helmet": "^4.1.0",
  "morgan": "^1.10.0",
  "multer": "^1.4.2",
  "passport": "^0.4.1",
  "passport-facebook": "^3.0.0",
  "passport-github": "^1.1.0",
  "passport-google-oauth": "^2.0.0",
  "passport-local": "^1.0.0",
  "passport-remember-me": "0.0.1",
  "stripe": "^8.129.0"
}

```
Run command below to install those packages:
``` Shell
npm install
```

2. Folder structure

```
- config/
  - multer.js
- controllers/
- helper/
- node_modules/
- passport/
- public/
- routes/
- views/
- tmp/
  - avatar/
  - productImg/
- server.js
```

3. Enviorment variables

```
# KEYS
### FACEBOOK 
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
### GITHUB
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
### GOOGLE
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
# APP SERVER
SERVER_URL
# API SEVER
API_SERVER_URL
# SESSION SECRET
SESSION_SECRET
# STRIPE
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
```
