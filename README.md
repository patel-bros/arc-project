# Arc Project

Arc Project is a full-stack crypto wallet and payment platform for shopping via Curve, featuring facial recognition for user authentication, Solana blockchain integration, and a browser extension for seamless payments.

## Project Structure

```
arc-project/
├── arc-backend/         # Django REST API backend with Solana and face recognition
├── arc-extension/       # Chrome extension for Arc Wallet
├── arc-web-dashboard/   # React dashboard for users/admins
├── curve/               # Curve shopping frontend (React)
```

---

## Components

### 1. arc-backend
- **Tech:** Django, Django REST Framework, Solana Python SDK, face_recognition
- **Features:**
  - User registration and wallet creation
  - Face registration and authentication
  - Solana payment API endpoints

### 2. arc-extension
- **Tech:** Chrome Extension (Manifest V3), JavaScript
- **Features:**
  - Popup UI for wallet actions
  - Content script for payment triggers
  - Background script for handling payment events

### 3. arc-web-dashboard
- **Tech:** React, Vite, TailwindCSS
- **Features:**
  - User dashboard for wallet management
  - Admin dashboard for monitoring

### 4. curve
- **Tech:** React, Vite, TailwindCSS
- **Features:**
  - Shopping frontend
  - "Pay with Arc" button integration

---

## Setup Instructions

### Backend (arc-backend)
1. Create and activate a Python virtual environment:
   ```sh
   python -m venv env
   env\Scripts\activate
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   pip install face_recognition
   pip install solana
   ```
3. Run migrations:
   ```sh
   python manage.py migrate
   ```
4. Start the server:
   ```sh
   python manage.py runserver
   ```

### Chrome Extension (arc-extension)
1. Load `arc-extension` as an unpacked extension in Chrome.
2. Ensure `popup.html`, `background.js`, and `content.js` are present.

### Web Dashboard (arc-web-dashboard) & Curve Frontend (curve)
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

---

## Usage

- **Register:** Users sign up and register their face via the dashboard.
- **Shop:** Users browse products on Curve and use "Pay with Arc" for checkout.
- **Extension:** The Arc Wallet extension handles payment requests and authentication.
- **Payments:** Transactions are processed on the Solana blockchain.

---

## Technologies

- **Backend:** Django, REST Framework, Solana Python SDK, face_recognition
- **Frontend:** React, Vite, TailwindCSS
- **Extension:** Chrome Extension (Manifest V3)
- **Blockchain:** Solana

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## License

MIT License

---

## Authors

- Rudra Patel