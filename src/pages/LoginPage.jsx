import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha email e senha.');
      return;
    }
    
    setError('');
    setLoading(true);

    setError('');
    setLoading(true);

    try {
      const data = await api.post('/login', {
        email: email,
        senha: password,
      });
      
      // Armazena o token no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setLoading(false);
      navigate('/patrimonios');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Email ou senha incorretos.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className='login-title'>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {/* TODO: adicionar link de esquecer senha */}
      </form>
    </div>
  );
}

export default LoginPage;
