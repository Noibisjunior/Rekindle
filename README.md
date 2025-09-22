# Rekindle API

## Overview
Rekindle is a robust TypeScript-based backend API for managing professional connections, built with Express.js, MongoDB, and Redis (BullMQ). It provides secure authentication, dynamic QR code generation, comprehensive user profile management with image uploads, and a sophisticated reminder system to foster meaningful professional relationships. 

## Features
- **Authentication**: Secure user authentication with local (email/password) and Google OAuth strategies, utilizing JWT for API access.
- **User Profile Management**: Enables users to update their profiles, including full name, title, company, bio, social media links, and professional tags.
- **Image Uploads**: Integrated Cloudinary for efficient and scalable profile picture storage and management.
- **Dynamic QR Code Generation**: Generates unique QR codes for each user, facilitating easy and digital connection sharing.
- **Connection Management**: Allows users to initiate connections with others via QR codes, accept pending connection requests, and retrieve lists of established connections.
- **Connection Analytics**: Provides real-time statistics on connections, including total, weekly, monthly, and pending connection counts.
- **Reminder System**: Schedules and delivers timely follow-up reminders via email, powered by BullMQ and Redis for robust background processing and fault tolerance.
- **Data Persistence**: Leverages MongoDB with Mongoose for reliable, schema-based data storage.
- **API Security**: Implements industry-standard security practices with Helmet, CORS, and Express Rate Limit to protect against common web vulnerabilities.
- **Background Job Processing**: Utilizes BullMQ to manage and process asynchronous tasks efficiently, ensuring core API responsiveness.

## Getting Started
### Installation
To get started with the Rekindle API, follow these steps to set up the project locally:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Noibisjunior/Rekindle.git
    cd Rekindle/backend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Build the Project**:
    ```bash
    npm run build
    ```
4.  **Start the API Server**:
    ```bash
    npm start
    ```
5.  **Start the Reminder Worker (in a separate terminal)**:
    ```bash
    npm run start:worker
    ```

### Environment Variables
Create a `.env` file in the `backend` directory and configure the following required environment variables:

```ini
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/rekindle_db # Your MongoDB connection URI
JWT_SECRET=your_jwt_access_token_secret_string_at_least_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_token_secret_string_at_least_32_chars
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here # Optional: Required for Google authentication
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD= # Optional: Your Redis password if applicable
SMTP_HOST=smtp.mailtrap.io # Example: Your SMTP host for email sending
SMTP_PORT=2525 # Example: Your SMTP port
SMTP_SECURE=false # Set to true for SSL/TLS, false for STARTTLS
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
PUBLIC_APP_URL=http://localhost:3000 # The base URL of your frontend application, used for QR codes
```

## API Documentation
### Base URL
`http://localhost:4000/v1` (or your deployed server's base URL)

### Endpoints

#### POST /auth/signup
Registers a new user with email and password.
**Request**:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "name": "John Doe"
}
```
**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}
```
**Errors**:
- 409: EmailInUse
- 500: ServerError1

#### POST /auth/login
Authenticates a user with email and password.
**Request**:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```
**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}
```
**Errors**:
- 401: InvalidCredentials
- 500: ServerError

#### POST /auth/google
Authenticates or registers a user using a Google ID token.
**Request**:
```json
{
  "idToken": "eyJhbGciOiJIUzI1Ni.eyJhdWQiOiIxMjM0NTY3ODkwMTIu..."
}
```
**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}
```
**Errors**:
- 500: GoogleNotConfigured (if `GOOGLE_CLIENT_ID` is not set)
- 401: GoogleAuthFailed

#### GET /auth/me
Retrieves the profile of the authenticated user.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
**Response**:
```json
{
  "user": {
    "_id": "65e23c0b05b3d6a6c23a4b6c",
    "email": "user@example.com",
    "profile": {
      "fullName": "John Doe",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "bio": "Passionate developer.",
      "photoUrl": "https://res.cloudinary.com/...",
      "socials": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "twitter": "https://twitter.com/johndoe"
      },
      "tags": ["Node.js", "TypeScript"]
    }
  }
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken

#### PUT /auth/me
Updates the profile information of the authenticated user.
**Request**:
_Requires `Authorization: Bearer <accessToken>` header._
```json
{
  "fullName": "Jane Doe",
  "title": "Senior Engineer",
  "company": "Global Innovations",
  "bio": "Dedicated to innovation and clean code.",
  "socials": {
    "linkedin": "https://linkedin.com/in/janedoe"
  },
  "tags": ["JavaScript", "React", "MongoDB"]
}
```
**Response**:
```json
{
  "user": {
    "_id": "65e23c0b05b3d6a6c23a4b6c",
    "email": "user@example.com",
    "profile": {
      "fullName": "Jane Doe",
      "title": "Senior Engineer",
      "company": "Global Innovations",
      "bio": "Dedicated to innovation and clean code.",
      "socials": {
        "linkedin": "https://linkedin.com/in/janedoe",
        "twitter": "https://twitter.com/johndoe"
      },
      "tags": ["JavaScript", "React", "MongoDB"]
    }
  }
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken
- 400: ValidationError
- 404: NotFound

#### POST /auth/me/photo
Uploads a profile photo for the authenticated user.
**Request**:
_Requires `Authorization: Bearer <accessToken>` header._
_`Content-Type: multipart/form-data`_
_Body contains an image file under the field name `photo`._
**Response**:
```json
{
  "photoUrl": "https://res.cloudinary.com/your_cloud_name/image/upload/v123456789/connectlink/profiles/abcxyz.jpg",
  "user": {
    "_id": "65e23c0b05b3d6a6c23a4b6c",
    "email": "user@example.com",
    "profile": {
      "photoUrl": "https://res.cloudinary.com/your_cloud_name/image/upload/v123456789/connectlink/profiles/abcxyz.jpg"
      // ... other profile fields
    }
  }
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken
- 400: NoFile
- 500: UploadFailed
- 500: ServerError

#### GET /me/qr
Generates and retrieves the QR code details for the authenticated user.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
**Response**:
```json
{
  "code": "uniqueQrCode12",
  "url": "http://localhost:3000/u/uniqueQrCode12",
  "png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+V..."
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken

#### POST /connect/:code
Initiates a connection with another user using their QR code.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
_`code` is the QR code string of the target user in the URL path._
**Response**:
```json
{
  "_id": "65e23c0b05b3d6a6c23a4b6d",
  "aUserId": "65e23c0b05b3d6a6c23a4b6c",
  "bUserId": "65e23c0b05b3d6a6c23a4b6e",
  "status": "pending",
  "createdAt": "2024-03-01T10:00:00.000Z"
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken
- 404: UserNotFound
- 400: CannotConnectToSelf
- 400: AlreadyConnectedOrPending

#### POST /connections/:id/accept
Accepts a pending connection request.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
_`id` is the ID of the connection document in the URL path._
**Response**:
```json
{
  "_id": "65e23c0b05b3d6a6c23a4b6d",
  "aUserId": "65e23c0b05b3d6a6c23a4b6c",
  "bUserId": "65e23c0b05b3d6a6c23a4b6e",
  "status": "accepted",
  "createdAt": "2024-03-01T10:00:00.000Z",
  "updatedAt": "2024-03-01T10:05:00.000Z"
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken
- 404: NotFound
- 403: NotAuthorized

#### GET /connections
Lists all accepted connections for the authenticated user.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
_Query Parameters (optional):_
- `event`: Filter by event name.
- `tag`: Filter by a specific tag.
- `sort`: Field to sort by (e.g., `createdAt`). Default is `createdAt`.
- `limit`: Maximum number of connections to return. Default is `20`.
**Response**:
```json
[
  {
    "_id": "65e23c0b05b3d6a6c23a4b6d",
    "aUserId": {
      "_id": "65e23c0b05b3d6a6c23a4b6c",
      "profile": {
        "fullName": "Jane Doe",
        "photoUrl": "https://res.cloudinary.com/..."
      }
    },
    "bUserId": {
      "_id": "65e23c0b05b3d6a6c23a4b6e",
      "profile": {
        "fullName": "Alice Smith",
        "photoUrl": "https://res.cloudinary.com/..."
      }
    },
    "event": "Networking Mixer",
    "tags": ["Blockchain", "AI"],
    "status": "accepted",
    "createdAt": "2024-03-01T10:00:00.000Z"
  }
]
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken

#### GET /connections/stats
Retrieves connection statistics for the authenticated user.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
**Response**:
```json
{
  "total": 50,
  "thisWeek": 5,
  "thisMonth": 12,
  "pending": 3
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken

#### POST /reminders
Sets a new reminder for a specific connection.
**Request**:
_Requires `Authorization: Bearer <accessToken>` header._
```json
{
  "connectionId": "65e23c0b05b3d6a6c23a4b6d",
  "remindAt": "2024-03-10T09:00:00.000Z",
  "channel": "email",
  "message": "Follow up on the project proposal from the conference."
}
```
**Response**:
```json
{
  "_id": "65e23c0b05b3d6a6c23a4b6f",
  "userId": "65e23c0b05b3d6a6c23a4b6c",
  "connectionId": "65e23c0b05b3d6a6c23a4b6d",
  "remindAt": "2024-03-10T09:00:00.000Z",
  "channel": "email",
  "message": "Follow up on the project proposal from the conference.",
  "sent": false,
  "createdAt": "2024-03-05T15:30:00.000Z",
  "updatedAt": "2024-03-05T15:30:00.000Z"
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken

#### GET /reminders
Lists all active reminders for the authenticated user.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
**Response**:
```json
[
  {
    "_id": "65e23c0b05b3d6a6c23a4b6f",
    "userId": "65e23c0b05b3d6a6c23a4b6c",
    "connectionId": "65e23c0b05b3d6a6c23a4b6d",
    "remindAt": "2024-03-10T09:00:00.000Z",
    "channel": "email",
    "message": "Follow up on the project proposal from the conference.",
    "sent": false,
    "createdAt": "2024-03-05T15:30:00.000Z",
    "updatedAt": "2024-03-05T15:30:00.000Z"
  }
]
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken

#### DELETE /reminders/:id
Cancels a specific reminder.
**Request**:
_No body required. Requires `Authorization: Bearer <accessToken>` header._
_`id` is the ID of the reminder document in the URL path._
**Response**:
```json
{
  "ok": true
}
```
**Errors**:
- 401: MissingToken
- 401: InvalidToken
- 404: NotFound

## Usage
To run the Rekindle API in development mode, execute the following command:
```bash
npm run dev
```
This will start the main API server with automatic restarts on code changes.

For the background job processing (e.g., sending reminders), open a **separate terminal** and run the worker:
```bash
npm run worker
```

For production deployment, first build the project and then start the server and worker:
```bash
# Build the TypeScript project
npm run build

# Start the API server
npm start

# Start the reminder worker (in a separate process)
npm run start:worker
```

## Technologies Used
| Category           | Technology        | Description                                       |
| :----------------- | :---------------- | :------------------------------------------------ |
| **Backend Core**   | [TypeScript](https://www.typescriptlang.org/)     | Typed superset of JavaScript for scalable applications.   |
|                    | [Node.js](https://nodejs.org/en/)          | JavaScript runtime for server-side execution.           |
|                    | [Express.js](https://expressjs.com/)       | Fast, unopinionated, minimalist web framework.          |
| **Database**       | [MongoDB](https://www.mongodb.com/)        | NoSQL database for flexible data storage.               |
|                    | [Mongoose](https://mongoosejs.com/)        | ODM for MongoDB and Node.js.                            |
| **Job Queue**      | [BullMQ](https://docs.bullmq.io/)          | Robust, performant, and Redis-based queue for Node.js.  |
|                    | [ioredis](https://github.com/luin/ioredis) | High-performance Redis client for Node.js.              |
| **Authentication** | [JWT](https://jwt.io/)             | JSON Web Tokens for secure API authentication.          |
|                    | [bcrypt](https://www.npmjs.com/package/bcrypt)         | Password hashing library.                               |
|                    | [Google OAuth2Client](https://developers.google.com/identity/one-tap/web/guides/overview) | Google ID token verification for social login.    |
| **Utilities**      | [Zod](https://zod.dev/)             | TypeScript-first schema declaration and validation library. |
|                    | [Cloudinary](https://cloudinary.com/)      | Cloud-based image and video management.                 |
|                    | [Multer](https://github.com/expressjs/multer)          | Middleware for handling `multipart/form-data`.          |
|                    | [pino](https://getpino.io/)             | Extremely fast Node.js logger.                          |
|                    | [nanoid](https://github.com/ai/nanoid)         | Small, secure, URL-friendly unique string ID generator. |
|                    | [qrcode](https://www.npmjs.com/package/qrcode)         | QR Code generator.                                      |
|                    | [Nodemailer](https://nodemailer.com/about/)    | Send emails from Node.js.                               |
|                    | [dayjs](https://day.js.org/)           | Lightweight JavaScript date library.                    |
| **Security**       | [Helmet](https://helmetjs.github.io/)          | Secures Express apps by setting various HTTP headers.   |
|                    | [CORS](https://expressjs.com/en/resources/middleware/cors.html)           | Cross-Origin Resource Sharing middleware.               |
|                    | [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) | Basic rate-limiting middleware.                         |
| **Development**    | [ts-node-dev](https://github.com/wclr/ts-node-dev)   | Restarts Node.js app on file changes for TypeScript.    |
|                    | [ESLint](https://eslint.org/)          | Pluggable JavaScript linter.                            |
|                    | [Prettier](https://prettier.io/)         | Opinionated code formatter.                             |
|                    | [Jest](https://jestjs.io/)             | Delightful JavaScript Testing Framework.                |

## Contributing
We welcome contributions to Rekindle! To contribute, please follow these steps:

*   **Fork the repository** and clone it to your local machine.
*   **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`
*   **Make your changes** and ensure they adhere to the project's coding standards.
*   **Write and run tests** to verify your changes: `npm test`
*   **Lint and format your code**: `npm run lint` and `npm run format`
*   **Commit your changes** with a clear and concise message: `git commit -m "feat: Add new feature"`
*   **Push your branch** to your forked repository: `git push origin feature/your-feature-name`
*   **Open a Pull Request** to the `main` branch of this repository, describing your changes in detail.

## License
This project is currently without a specific open-source license. All rights are reserved by the author.

## Author
**Noibisjunior**

*   [LinkedIn](https://linkedin.com/in/abdulsalaam-noibi)
*   [X](https://x.com/clericcoder)

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C1?style=for-the-badge&logo=Cloudinary&logoColor=white)](https://cloudinary.com/)
[![BullMQ](https://img.shields.io/badge/BullMQ-FF5400?style=for-the-badge&logo=bullmq&logoColor=white)](https://docs.bullmq.io/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)

