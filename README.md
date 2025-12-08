# Vehicle Rental System

**Live URL:** [https://vehicle-rental-system-1.vercel.app/](https://vehicle-rental-system-1.vercel.app/)

---

## Project Overview

A backend API for managing a vehicle rental system with:

- **Vehicles:** Inventory management with availability tracking
- **Customers:** Manage user accounts and profiles
- **Bookings:** Create, update, return, and cancel rentals with automatic price calculation
- **Authentication:** Role-based access control (Admin & Customer)

---

## Technology Stack

- Node.js + TypeScript
- Express.js (Web Framework)
- PostgreSQL (Database)
- bcryptjs (Password Hashing)
- jsonwebtoken (JWT Authentication)
- node-cron (Automated tasks)

---

## Project Structure

Modular pattern with clear separation of concerns:

- `routes/` – API endpoints
- `controllers/` – Request handlers
- `services/` – Business logic & DB queries
- `config/` – Database and environment setup
- `modules/` – Feature-based modules (auth, users, vehicles, bookings)

---

## 📊 Database Tables

**Users**

- id (Auto-generated)
- name, email, password, phone
- role: `admin` | `customer`

**Vehicles**

- id (Auto-generated)
- vehicle_name, type (`car|bike|van|SUV`), registration_number
- daily_rent_price (positive), availability_status (`available|booked`)

**Bookings**

- id (Auto-generated)
- customer_id → Users
- vehicle_id → Vehicles
- rent_start_date, rent_end_date
- total_price, status (`active|cancelled|returned`)

---

## 🔐 Authentication & Authorization

- **Admin:** Full access (users, vehicles, bookings)
- **Customer:** Manage own bookings
- Passwords hashed with bcrypt
- JWT-based login (`/api/v1/auth/signin`)
- Protected routes require header:
