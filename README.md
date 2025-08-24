
# ARC Project

ARC Project is a full-stack crypto wallet and payment platform designed for real-world shopping and payments. This project is the result of dedicated teamwork, late nights, and a shared vision to make crypto accessible and practical for everyone.

### Motivation & Human Effort

The ARC Project was born out of a desire to solve real problems faced by users and merchants in the crypto space:
- **Security:** We wanted to make crypto wallets safer, so we built facial recognition for authentication.
- **Speed:** By integrating Solana, we ensured transactions are fast and affordable.
- **Usability:** Our browser extension and dashboard are designed for simplicity, so anyone can use them.
- **Shopping Integration:** We worked closely with merchants to make "Pay with Arc" a seamless experience on Curve.

Every feature was discussed, designed, and tested by our team. We listened to feedback, iterated on UI/UX, and overcame technical challenges together. The result is a platform that reflects real human effort and care.

### Real-World Impact

ARC Project is already being used by early adopters to shop online, manage crypto assets, and experience secure payments. Our goal is to empower users and merchants to embrace the future of finance, with tools that feel familiar and trustworthy.

---

---

## Brand Identity

The ARC platform uses a professional brand identity with the official ARC logo (located at `/public/arc.png` in the web dashboard). The logo is integrated into:
- Web dashboard sidebar navigation
- Login and registration page headers
- Browser favicon
- Application title and branding

The logo represents the "ARC" brand—symbolizing a bridge between traditional finance and cryptocurrency, with a focus on growth, connection, and innovation.

---

## Project Structure

```
arc-project/
├── arc-backend/         # Django REST API backend (Solana, face recognition)
├── arc-extension/       # Chrome extension for Arc Wallet
├── arc-web-dashboard/   # React dashboard for users/admins
├── curve/               # Curve shopping frontend (React)
```

---

## Components

### arc-backend
**Tech:** Django, Django REST Framework, Solana Python SDK, face_recognition
**Features:**
- User registration and wallet creation
- Face registration and authentication
- Solana payment API endpoints

### arc-extension
**Tech:** Chrome Extension (Manifest V3), JavaScript
**Features:**
- Popup UI for wallet actions
- Content script for payment triggers
- Background script for handling payment events

### arc-web-dashboard
**Tech:** React, Vite, TailwindCSS
**Features:**
- User dashboard for wallet management
- Admin dashboard for monitoring

### curve
**Tech:** React, Vite, TailwindCSS
**Features:**
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

1. **Register:** Sign up and register your face via the dashboard for secure authentication.
2. **Shop:** Browse products on Curve and use "Pay with Arc" for checkout.
3. **Extension:** The Arc Wallet extension handles payment requests and authentication.
4. **Payments:** Transactions are processed on the Solana blockchain for speed and security.

---

## Technologies

- **Backend:** Django, REST Framework, Solana Python SDK, face_recognition
- **Frontend:** React, Vite, TailwindCSS
- **Extension:** Chrome Extension (Manifest V3)
- **Blockchain:** Solana

---

## Contributing

We welcome contributions from developers of all backgrounds. To contribute:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description of your changes

---

## License

This project is licensed under the MIT License.

---

## Authors

- Rudra Patel