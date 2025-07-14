# 🧾 Inventory Management System For Small Businesses

A lightweight full-stack web application to help small businesses manage inventory, log sales, track transactions, and analyze performance with visual insights.

---

## ✨ Features

- 🔐 **User Authentication** with role-based access (Admin & Staff)
- 📦 **Product Management** (Add, Edit, Delete, Low-stock alerts)
- 💰 **Sales Logging** with automated revenue/profit calculation
- 🔄 **Inventory Transactions** (stock in/out)
- 📊 **Analytics Dashboard** with charts:
  - Monthly Revenue (Line Chart)
  - Top-Selling Products (Bar Chart)
  - Monthly Profit (Line Chart)
  - Low Stock Products
- 📋 **Admin Tools**:
  - View all users
  - Change user roles
  - Delete users
- 🎯 Toast notifications for all user actions
- 📁 Modular code structure (clean components for dashboard, modals, charts, etc.)

---

## 🛠️ Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | React.js, Axios, React Router    |
| Backend     | Node.js, Express                 |
| Database    | SQLite                           |
| Auth        | JWT (with role-based control)    |
| Charts      | Recharts                         |
| Styling     | Custom CSS + Toastify            |
| Testing     | Postman                          |

---

## 📁 Folder Structure

my-inventory-app/
├── backend/
│   ├── controllers/         
│   ├── database/            
│   ├── middleware/          
│   ├── routes/             
│   └── server.js            
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/   
│   │   │   └── modals/      
│   │   ├── pages/           
│   │   ├── api/             
│   │   └── App.js           
├── .env                     
├── README.md
 
---