# Shop Pretest – Admin System

A simple admin system built with **Node.js**, **Express.js**, **EJS**, and **MySQL**.
This project is part of a pretest task for creating a small store management system.

## Features

* View product list
* Manage product stock
* Create purchase transactions
* Cancel purchases (with automatic stock return)
* Basic, clean admin UI using EJS templates

---

## Tech Stack

* **Node.js + Express.js**
* **EJS Template Engine**
* **MySQL (XAMPP / Local Server)**
* **CSS (custom styles)**

---

## Installation

### 1. Clone Repository

```
git clone <repository-url>
cd shop-pretest
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=shop_pretest
PORT=3000
```

Adjust DB_PASSWORD if needed.

---

## Database Setup

### 1. Start MySQL (via XAMPP or local service)

### 2. Import Database

1. Open phpMyAdmin
2. Create new database:

```
shop_pretest
```

3. Import SQL file located at:

```
sql/schema.sql
sql/seed.sql
```

Database will automatically include:

* `products` (with 10 sample items)
* `stock`
* `purchases`

---

## Running the Server

Start the application with:

```
npm start
```

If successful, you will see:

```
Server jalan di http://localhost:3000
```

Access in browser:

```
http://localhost:3000
```

---

## Available Pages

### • Product List

`/products`
Displays all products with their current stock.

### • Create Purchase

`/purchase/create`
Admin can create a purchase transaction.

### • View Purchases

`/purchases`
List of all completed and cancelled purchases.

### • Cancel Purchase

Performed via button on purchase list page.
Cancelling a purchase will:

* Mark status as `cancelled`
* Restore stock automatically

---

## Project Structure

```
shop-pretest/
│── app.js
│── db.js
│── package.json
│── .env
│── sql/
│     └── schema.sql
│     └── seed.sql
│── views/
│     ├── layout.ejs
│     ├── products.ejs
│     ├── create-purchase.ejs
│     └── purchases.ejs
│── public/
      └── styles.css
```

---

## Stopping the Server

Press:

```
CTRL + C
```

in the terminal.

---
