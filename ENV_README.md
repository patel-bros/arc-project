# Environment Configuration

This project uses centralized environment configuration in the root directory.

## 🚀 Quick Usage

### For Development:
```bash
# Windows
build.bat development

# Linux/Mac
chmod +x build.sh
./build.sh development
```

### For Production:
```bash
# Windows  
build.bat production

# Linux/Mac
./build.sh production
```

## 📁 Files Structure

```
arc-project/
├── .env                          # Current active environment
├── .env.development             # Development settings  
├── .env.production              # Production settings
├── arc-backend/
│   └── .env                     # Backend env (copied from root)
└── arc-extension/
    └── config.js               # Extension config
```

## 🔧 Environment Variables

### Backend (Django):
- Uses `DJANGO_*` prefixed variables
- Reads from `arc-backend/.env` (copied from root)

### Frontend (React/Vite):
- Uses `VITE_*` prefixed variables  
- Reads from root `.env` automatically

### Extension:
- Uses `config.js` for environment switching
- Updated automatically by build scripts

## 🌐 URLs

### Development:
- Backend: `http://localhost:8000`
- Curve: `http://localhost:5173`
- Dashboard: `http://localhost:5174`

### Production:
- Backend: `https://arc-backend-production-5f89.up.railway.app`
- Curve: Your Vercel URL (update in `.env.production`)
- Dashboard: Your Vercel URL (update in `.env.production`)

## 📝 Update Production URLs

Edit `.env.production` and replace:
```
CURVE_FRONTEND_URL=https://your-actual-curve-url.vercel.app
DASHBOARD_FRONTEND_URL=https://your-actual-dashboard-url.vercel.app
```

Then run `build.bat production` to apply changes.

## 🔄 Manual Environment Switch

```bash
# Copy environment file
cp .env.production .env

# Copy to backend
cp .env.production arc-backend/.env

# Update extension manually in arc-extension/config.js:
# Change: const CURRENT_ENV = 'development';
# To: const CURRENT_ENV = 'production';
```
