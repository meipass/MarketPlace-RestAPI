# Marketplace API

## Project overview
This is a RESTful API for a marketplace platform, where users can register, authenticate, and manage product listings.

## Features

- User registration and authentication
- JWT-based authentication
- Refresh token rotation and logout
- Product CRUD operations
- Product ownership validation
- Product pagination

## Tech stack

- Runtime: **Node.js**
- Language: **TypeScript**
- Framework: **Express 5**
- Database: **PostgreSQL**
- Database driver: **pg**
- Authentication: **JWT, bcrypt**
- Configuration: **dotenv**
- Development: **tsx**

## Getting started
### Prerequisites

- [Node.js](https://nodejs.org/en/download)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1. Install required software
2. Clone the repository. `git clone https://github.com/meipass/MarketPlace-RestAPI.git`
3. Open shell in the project folder using `cd` command
4. Run `npm install` to install all required packages
5. Copy .env.example into .env
6. Configure .env

### Environment Variables

`.env`
| Variable | Description | Required |
| --- | --- | --- |
| PORT | Server port | Yes |
| DB_HOST | PostgreSQL host | Yes |
| DB_PORT | PostgreSQL port | Yes |
| DB_NAME | Database name | Yes |
| DB_USER | Database username | Yes |
| DB_PASSWORD | Database password | Yes |
| ACCESS_JWT_SECRET | Secret used to sign user access token | Yes |
| REFRESH_JWT_SECRET | Secret used to sign user refresh token | Yes |

### Starting

1. Open shell in the project folder using `cd` command
3. Run `npm run dev`
4. Done!

### API Documentation

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | /auth/register | Register a new user with an email, login and password  | No |
| POST | /auth/login | Authenticate a user | No |
| POST | /auth/refresh | Refresh access and refresh tokens using a valid refresh token | Refresh token required |
| POST | /auth/logout | Logout by revoking the refresh token | Refresh token required |
