# Sheryians - ECommerce Application

Modern, full-featured eCommerce application built with React, Vite, and TailwindCSS.

## Features

- 🛍️ Product browsing with categories
- 🔍 Real-time search
- 🛒 Shopping cart functionality
- ➕ Add/Edit/Delete products
- 🌓 Dark/Light mode
- 📱 Fully responsive
- 🔔 Toast notifications

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** (@tailwindcss/vite) - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/      # React components
├── context/         # Context providers (Theme, App)
├── utils/           # Utilities (axios config)
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## API Endpoints

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/:id/image` - Get product image
- `GET /products/search?keyword=` - Search products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL

---

Built with ❤️ for Sheryians
