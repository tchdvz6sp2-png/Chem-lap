# Chem-Lap - Laboratory Management System

A comprehensive web-based laboratory management system for tracking chemicals, experiments, and safety protocols.

## Features

- **Dashboard** - View laboratory status, active experiments, and important alerts
- **Inventory Management** - Track chemicals, quantities, expiry dates, and receive low stock notifications
- **Experiment Log** - Document experiments with procedures, results, and chemical usage
- **Safety Protocols** - Access digitized safety measures and procedures
- **User Management** - Role-based access control (Admin, Technician, Viewer)

## Technology Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Database (easily extensible to PostgreSQL/MySQL)
- **JWT** - Authentication and authorization
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
Chem-lap/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py      # Authentication routes
│   │   │   ├── chemicals.py # Chemical inventory routes
│   │   │   ├── experiments.py # Experiment routes
│   │   │   ├── safety.py    # Safety protocol routes
│   │   │   └── dashboard.py # Dashboard metrics routes
│   │   └── utils/           # Utility functions
│   ├── config/              # Configuration files
│   ├── app.py               # Flask application entry point
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── contexts/        # React contexts
    │   └── utils/           # Utility functions
    └── package.json         # Node dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Quick Start (Recommended)

**Linux/Mac:**
```bash
./run_dev.sh
```

**Windows:**
```
run_dev.bat
```

The scripts will:
1. Create and activate Python virtual environment
2. Install all backend dependencies
3. Install all frontend dependencies
4. Start both backend and frontend servers
5. Initialize the database with a default admin user

Default admin credentials:
- Username: `admin`
- Password: `admin123`

### Manual Setup

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
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask application:
   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`

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

   The frontend will run on `http://localhost:3000`

## Usage

### First Time Setup

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Register a new account (first user will be a technician by default)
4. Login with your credentials

### User Roles

- **Admin**: Full access to all features, can delete items and manage safety protocols
- **Technician**: Can add/edit chemicals and experiments
- **Viewer**: Read-only access

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

#### Chemicals
- `GET /api/chemicals` - Get all chemicals
- `POST /api/chemicals` - Create a new chemical
- `PUT /api/chemicals/:id` - Update a chemical
- `DELETE /api/chemicals/:id` - Delete a chemical
- `GET /api/chemicals/low-stock` - Get low stock chemicals
- `GET /api/chemicals/expiring-soon` - Get expiring chemicals

#### Experiments
- `GET /api/experiments` - Get all experiments
- `POST /api/experiments` - Create a new experiment
- `PUT /api/experiments/:id` - Update an experiment
- `DELETE /api/experiments/:id` - Delete an experiment
- `GET /api/experiments/my` - Get current user's experiments

#### Safety Protocols
- `GET /api/safety-protocols` - Get all safety protocols
- `POST /api/safety-protocols` - Create a safety protocol (admin only)
- `PUT /api/safety-protocols/:id` - Update a safety protocol (admin only)
- `DELETE /api/safety-protocols/:id` - Delete a safety protocol (admin only)

#### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/alerts` - Get alerts (low stock, expiring items)

## Environment Variables

Create a `.env` file in the backend directory for production:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///laboratory.db
FLASK_ENV=production
```

## Database Schema

### Users
- id, username, email, password_hash, role, created_at

### Chemicals
- id, name, formula, cas_number, quantity, unit, location, expiry_date, minimum_stock, hazard_class, created_at, updated_at

### Experiments
- id, title, description, procedure, results, status, user_id, created_at, updated_at

### ExperimentChemicals
- id, experiment_id, chemical_id, quantity_used, unit

### SafetyProtocols
- id, title, description, category, applicable_to, created_at, updated_at

## Future Enhancements

- Export data to CSV/PDF
- Advanced search and filtering
- Email notifications for alerts
- Barcode scanning for chemicals
- Multi-language support
- Data visualization and analytics
- Mobile application
- Integration with external chemical databases

## Security Considerations

- Passwords are hashed using Werkzeug's security utilities
- JWT tokens are used for authentication
- CORS is configured for secure cross-origin requests
- Input validation on both frontend and backend
- Role-based access control for sensitive operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.