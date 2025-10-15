
# Math API — Express.js CRUD Server

Simple Express.js REST API for a `products` resource. This README explains how to run the server and documents the API endpoints with example requests and responses.

---

## 🧰 Prerequisites

- Node.js v18+ (recommended)
- npm

---

## 📦 Install

```powershell
npm install
```

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env` and set your values. At minimum, set the API key:

```properties
PORT=3000
API_KEY=your_api_key_here
```

> ⚠️ Do not commit your `.env` file. Ensure `.env` is listed in `.gitignore`.

---

## 🚀 Run the Server

Start normally:

```powershell
npm start
```

Start in watch mode (auto-restart on changes):

```powershell
npm run dev
```

By default, the server listens on the port from `.env` or `3000`.

---

## 🔐 Authentication

All requests must include the following header:

```text
Authorization: Bearer YOUR_API_KEY
```

Replace `YOUR_API_KEY` with the value from your `.env` file.

---

## 📦 API Endpoints

### Base URL

```
http://localhost:3000/api/products
```

---

## 🧾 Usage via CMD (Windows)

Use the following commands in Windows CMD to interact with the API. Replace `PRODUCT_ID` with the actual product ID (e.g., `1` or a UUID).

```cmd
:: Get all products
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/products

:: Get a single product by ID
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/products/PRODUCT_ID

:: Create a new product
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -d "{\"name\":\"Notebook\",\"description\":\"Ruled notebook\",\"price\":3.50,\"category\":\"Stationery\",\"inStock\":true}" http://localhost:3000/api/products

:: Update an existing product
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -d "{\"price\":4.00,\"inStock\":false}" http://localhost:3000/api/products/PRODUCT_ID

:: Delete a product by ID
curl -X DELETE -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/products/PRODUCT_ID
```

---

## 📘 Notes

- These commands are designed for **Windows CMD only**.
- Ensure your server is running and accessible at `http://localhost:3000`.
- All endpoints require a valid bearer token.
- JSON payloads must be properly escaped using `\"` inside CMD.

---

## 🧪 Example Product Object

```json
{
  "name": "Notebook",
  "description": "Ruled notebook",
  "price": 3.5,
  "category": "Stationery",
  "inStock": true
}
```

---

## 📂 Project Structure

The repository follows the simple Express assignment layout used in this project. Files and folders you should see:

```
package.json
README.md
server.js
.env.example

controllers/
  └── productsController.js

routes/
  └── products.js

data/
  └── products.json

middleware/
  ├── auth.js
  ├── errorHandler.js
  ├── logger.js
  └── validateProduct.js

utils/
  ├── errors.js
  └── dataStore.js

scripts/
  └── smoke-test.cmd
```

If your repo differs (e.g., renamed folders or removed `scripts/`), update this list to match your filesystem.

---

## 🧑‍💻 Author

Built and maintained by Wanchah.
```
