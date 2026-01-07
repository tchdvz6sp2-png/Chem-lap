import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await authService.register(formData.username, formData.email, formData.password);
        alert('Registrace byla úspěšná! Přihlaste se prosím.');
        setIsRegister(false);
        setFormData({ username: '', email: '', password: '' });
      } else {
        await authService.login(formData.username, formData.password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Došlo k chybě');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? 'Registrace' : 'Přihlášení'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Uživatelské jméno</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {isRegister && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Heslo</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isRegister ? 'Registrovat' : 'Přihlásit se'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {isRegister ? 'Již máte účet?' : 'Nemáte účet?'}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isRegister ? 'Přihlásit se' : 'Registrovat'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
