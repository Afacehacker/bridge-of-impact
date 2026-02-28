# Deployment Guide - Bridge of Impact Initiative

This document outlines the steps to deploy the Bridge of Impact Initiative platform (MERN stack).

## 1. Environment Variables Setup

Ensure you have a `.env` file in both the `client` and `server` folders with production values.

### Server (.env)
- `PORT`: Usually provided by the hosting service (e.g., 5000, 8080).
- `MONGODB_URI`: Your production MongoDB connection string (Atlas recommended).
- `JWT_SECRET`: A long, secure random string.
- `NODE_ENV`: Set to `production`.
- `PAYSTACK_SECRET_KEY`: Your live secret key from Paystack.
- `FRONTEND_URL`: Your production domain (e.g., `https://bridgeofimpact.org`).

### Client (.env)
- `VITE_API_URL`: Your API endpoint (e.g., `https://api.bridgeofimpact.org/api` or just `/api` if using a single domain).
- `VITE_PAYSTACK_PUBLIC_KEY`: Your live public key from Paystack.

## 2. Production Build

Run the following commands to create a production-ready bundle of the frontend:

```bash
cd client
npm run build
```

The build files will be generated in `client/dist`.

## 3. Server Configuration

The Express server (`server/server.js`) is already configured to serve the static frontend files from `client/dist` when `NODE_ENV=production`.

## 4. Hosting Options

### Option A: Unified Hosting (Render / Railway / DigitalOcean)
1. Push your code to a GitHub repository.
2. Connect the repository to your hosting provider.
3. Configure the build command: `npm install && cd client && npm install && npm run build` (or similar).
4. Configure the start command: `cd server && npm start`.
5. Set the environment variables in the hosting provider's dashboard.

### Option B: Separate Hosting (Vercel/Netlify for Client + Heroku/Railway for Server)
1. Deploy the `server` folder to your backend host.
2. Deploy the `client` folder to Vercel/Netlify.
3. **CRITICAL**: Update `VITE_API_URL` in the client to point to your deployed server URL.
4. **CRITICAL**: Update `FRONTEND_URL` in the server to point to your deployed client URL for CORS.

## 5. Post-Deployment Checklist
- [ ] Verify SSL certificate (HTTPS).
- [ ] Test the donation flow with a small test amount.
- [ ] Ensure the Admin dashboard is accessible and secure.
- [ ] Check if images are uploading and displaying correctly.

---
*Built with ❤️ for Bridge of Impact Initiative.*
