# Chem-Lap - Laboratory Management System

A comprehensive web-based laboratory management system for tracking chemical inventory, logging experiments, and managing safety protocols.

🌐 **Live Demo:** [https://tchdvz6sp2-png.github.io/Chem-lap](https://tchdvz6sp2-png.github.io/Chem-lap)

## Features

- **Dashboard** - Central hub displaying key metrics, alerts for low stock and expiring chemicals
- **Inventory Management** - Track chemicals with quantities, locations, expiry dates, and safety information
- **Experiment Logging** - Document experiments with procedures, results, and chemicals used
- **Safety Protocols** - Digital access to safety measures and guidelines
- **User Authentication** - Role-based access control (Admin, Technician, Viewer)

## Technology Stack

### Backend
- Python 3.x
- Flask (Web framework)
- SQLite (Database)
- Flask-JWT-Extended (Authentication)
- Flask-CORS (Cross-origin support)

### Frontend
- React 18
- React Router (Navigation)
- Axios (HTTP client)

## Project Structure

```
Chem-lap/
├── backend/
│   ├── app.py              # Flask application entry point
│   ├── config.py           # Configuration settings
│   ├── models.py           # Database models
│   ├── routes.py           # API endpoints
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── App.js          # Main application component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Node dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. (Optional) Seed the database with sample data:
```bash
python seed.py
```

This creates:
- Admin user (username: `admin`, password: `admin123`)
- Sample chemicals with varying stock levels and expiry dates
- Safety protocols covering general lab safety, chemical handling, emergency procedures, and PPE requirements

6. Run the backend server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

### First Time Setup

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Click "Register" to create a new account
4. Login with your credentials
5. Start managing your laboratory!

### Default Roles
- **Admin**: Full access to all features
- **Technician**: Can manage inventory and experiments
- **Viewer**: Read-only access

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: { "username": "string", "email": "string", "password": "string", "role": "string" }
```

#### Login
```
POST /api/auth/login
Body: { "username": "string", "password": "string" }
Returns: { "access_token": "string", "user": {...} }
```

### Inventory Endpoints

- `GET /api/inventory/` - Get all chemicals
- `GET /api/inventory/:id` - Get specific chemical
- `POST /api/inventory/` - Add new chemical
- `PUT /api/inventory/:id` - Update chemical
- `DELETE /api/inventory/:id` - Delete chemical

### Experiment Endpoints

- `GET /api/experiments/` - Get all experiments
- `GET /api/experiments/:id` - Get specific experiment
- `POST /api/experiments/` - Create new experiment
- `PUT /api/experiments/:id` - Update experiment
- `DELETE /api/experiments/:id` - Delete experiment

### Safety Protocol Endpoints

- `GET /api/safety/` - Get all protocols
- `GET /api/safety/:id` - Get specific protocol
- `POST /api/safety/` - Create new protocol
- `PUT /api/safety/:id` - Update protocol
- `DELETE /api/safety/:id` - Delete protocol

### Dashboard Endpoints

- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/alerts` - Get alerts (low stock, expiring chemicals)

## Environment Variables

### Development
For local development, the application uses sensible defaults.

To enable debug mode in development:
```bash
export FLASK_ENV=development
```

### Production
Create a `.env` file in the backend directory with production values:

```
FLASK_ENV=production
SECRET_KEY=your-strong-random-secret-key-here
JWT_SECRET_KEY=your-strong-random-jwt-secret-here
DATABASE_URL=sqlite:///lab_management.db
```

**Important:** Never use the default secret keys in production. Generate strong random keys using:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Security Features

- Password hashing using Werkzeug
- JWT-based authentication
- Protected API endpoints
- CORS configuration for frontend-backend communication
- Error handling for localStorage operations

**Security Note:** The current implementation uses localStorage for token storage for simplicity. In a production environment, consider:
- Using httpOnly cookies for token storage
- Implementing refresh tokens
- Adding CSRF protection
- Using HTTPS for all communications
- Implementing rate limiting on API endpoints

## Deployment

### GitHub Pages (Frontend Only)

The frontend is automatically deployed to GitHub Pages on every push to the `main` branch.

**Live URL:** [https://tchdvz6sp2-png.github.io/Chem-lap](https://tchdvz6sp2-png.github.io/Chem-lap)

The deployment is handled by GitHub Actions (see `.github/workflows/deploy.yml`). The workflow:
1. Installs Node.js dependencies
2. Builds the React application
3. Deploys to GitHub Pages

**Note:** GitHub Pages only hosts the static frontend. The backend API needs to be deployed separately (e.g., Heroku, Railway, or any cloud platform that supports Python/Flask).

To configure the backend API URL for the deployed frontend, set the `REACT_APP_API_URL` environment variable during the build process.

## Future Enhancements

- Export reports (PDF, CSV)
- Advanced search and filtering
- Email notifications for expiring chemicals
- Barcode/QR code scanning
- Multi-laboratory support
- Audit logs and activity tracking

## Contributing

This is an open-source project. Contributions are welcome!

## License

MIT License

## Support

For issues and questions, please create an issue in the GitHub repository.