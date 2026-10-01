# Subtracker Frontend

React + Axios frontend for the Subtracker backend (Spring Boot).

## Setup

1. Make sure the backend is running on `http://localhost:8080` with the CORS
   configuration added (see `CorsConfig.java` and the updated `SecurityConfig.java`
   from the backend).

2. Install dependencies:
   ```
   npm install
   ```

3. Start the app:
   ```
   npm start
   ```
   This opens `http://localhost:3000` in your browser automatically.

## Configuration

The API base URL is set in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```
Change this if your backend runs on a different host/port, then restart `npm start`.

## What's inside

- `src/api/` — Axios client + one file per backend domain (auth, subscriptions,
  notifications, coupons, admin)
- `src/context/AuthContext.jsx` — holds the JWT token, role, and email in
  `localStorage`, exposes `login()` / `logout()`
- `src/components/` — `Sidebar`, `AppLayout`, `ProtectedRoute` (role-based route
  guarding), `Banner`
- `src/pages/` — `Login`, `Register`, then `customer/` and `admin/` folders for
  the role-specific screens

## Login flow

Registering only creates an account — it does **not** log you in automatically.
Log in separately with the same email/password to get a token.

## Roles

- **CUSTOMER** → redirected to `/subscriptions` after login
- **ADMIN** → redirected to `/admin/dashboard` after login

Visiting a route that doesn't match your role redirects you back to your
correct home page.
