# Marketplace API

## Project overview
A RESTful API for a marketplace platform built with Node.js, TypeScript, Express and PostgreSQL. The application provides user authentication, product management, ownership validation, filtering, sorting and pagination.

The project follows a layered architecture that separates HTTP handling, business logic and database access.

## Features

- **Authentication** — user registration and login using email and password.
- **HttpOnly cookie based authentication** — securely store authentication tokens in HttpOnly cookies to prevent client-side JavaScript from accessing them (XSS attacks).
- **Refresh token rotation** — issue new access and refresh tokens while revoking the previous refresh token.
- **Session revocation** — invalidate refresh tokens on logout.
- **Password hashing** — bcrypt password hashing.
- **Product management** — create, read, update and delete product listings.
- **Ownership validation** — only the product owner can modify or delete their listings.
- **Filtering and search** — filter products by price range and search by title.
- **Sorting** — sort products by price or title in ascending or descending order.
- **Pagination** — retrieve products in pages with a configurable page size.
- **Input validation** — validate authentication data and product query parameters.
- **Database transactions** — execute related database operations atomically during refresh token rotation.
- **Centralized error handling** — handle application errors through a shared Express error handler.

## Tech stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| HTTP framework | Express 5 |
| Database | PostgreSQL |
| Database driver | node-postgres (`pg`) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password hashing | bcrypt |
| Configuration | dotenv |
| Development | tsx |

## Getting started
### Prerequisites

- [Node.js](https://nodejs.org/en/download) with npm
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

Clone the repository:

```bash
git clone https://github.com/meipass/MarketPlace-RestAPI.git
cd MarketPlace-RestAPI
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on the example configuration:

```bash
cp .env.example .env
```

On Windows, you can copy the file manually or run:

```powershell
Copy-Item .env.example .env
```

Configure the environment variables and make sure PostgreSQL is running.

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

#### Authentication

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register a new user | None |
| POST | `/auth/login` | Authenticate a user and receive tokens | None |
| POST | `/auth/refresh` | Refresh access and refresh tokens | Refresh token in cookie |
| POST | `/auth/logout` | Revoke a refresh token | refresh token cookie |

#### Users

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| GET | `/users/me` | Get the authenticated user's profile | Access token in cookie |

#### Products

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| GET | `/products` | Get a paginated list of products with filtering and sorting | None |
| GET | `/products/:id` | Get a product by ID | None |
| POST | `/products` | Create a new product listing | Access token in cookie |
| PATCH | `/products/:id` | Update an existing product listing | Access token in cookie |
| DELETE | `/products/:id` | Delete a product listing | Access token in cookie |

## License

This project is currently distributed under the license specified in the repository.
