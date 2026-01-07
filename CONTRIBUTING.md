# Contributing to Chem-Lap

Thank you for your interest in contributing to Chem-Lap! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Setting Up Development Environment

1. Fork and clone the repository
```bash
git clone https://github.com/your-username/Chem-lap.git
cd Chem-lap
```

2. Set up backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
export FLASK_ENV=development  # Enable debug mode
```

3. Set up frontend
```bash
cd frontend
npm install
```

4. Seed the database (optional)
```bash
cd backend
python seed.py
```

## Code Style

### Python (Backend)
- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings for functions and classes
- Keep functions focused and small
- Use type hints where appropriate

### JavaScript/React (Frontend)
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Keep components focused and reusable
- Add comments for complex logic

## Making Changes

### Before You Start
1. Check existing issues to avoid duplicate work
2. Create an issue to discuss major changes
3. Fork the repository and create a new branch

### Development Workflow
1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Test your changes thoroughly
4. Commit with clear messages
```bash
git commit -m "Add: Brief description of what you added"
git commit -m "Fix: Brief description of what you fixed"
```

5. Push to your fork
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

## Testing

### Backend Testing
Currently using manual testing. To test API endpoints:
```bash
# Start the server
python app.py

# Test endpoints with curl or Postman
curl http://localhost:5000/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

### Frontend Testing
```bash
npm start  # Start development server
# Manually test the UI
```

## Adding New Features

### Adding a New API Endpoint
1. Add route in `backend/routes.py`
2. Add authentication if needed (`@jwt_required()`)
3. Implement proper error handling
4. Update API documentation in README

### Adding a New Frontend Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.js`
3. Add navigation link in `frontend/src/components/Navbar.js`
4. Create corresponding service functions in `frontend/src/services/`

### Adding a New Database Model
1. Add model class in `backend/models.py`
2. Create migration or let Flask-SQLAlchemy auto-create
3. Add corresponding API endpoints
4. Update seed script if needed

## Common Tasks

### Adding New Dependencies

**Backend:**
```bash
pip install package-name
pip freeze > requirements.txt
```

**Frontend:**
```bash
npm install package-name
# package.json is automatically updated
```

### Running Security Checks
- Use environment variable `FLASK_ENV=production` to test production mode
- Ensure no secrets are committed
- Validate all user inputs

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Changes are tested manually
- [ ] No console errors or warnings
- [ ] README updated if needed
- [ ] API documentation updated if needed
- [ ] No sensitive data in commits

### PR Description Should Include
- What changes were made
- Why the changes were made
- How to test the changes
- Screenshots for UI changes (if applicable)

## Areas for Contribution

### High Priority
- Unit tests for backend
- Integration tests
- Email notifications for alerts
- Export functionality (PDF/CSV)
- Advanced search and filtering

### Medium Priority
- Barcode/QR code scanning
- Multi-laboratory support
- Audit logs
- User profile management
- Dark mode

### Nice to Have
- Mobile app
- Offline support
- Advanced analytics
- Integration with lab equipment
- Automated inventory tracking

## Questions?

Feel free to:
- Open an issue for discussion
- Ask questions in pull requests
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Chem-Lap! 🧪
