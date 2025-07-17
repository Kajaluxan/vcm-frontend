import { useState } from 'react';
import { api } from '../api'; // 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (type) => {
    try {
      const endpoint = type === 'register' ? '/register' : '/login';

      // Use api.post instead of fetch
      const res = await api.post(endpoint, { username, password });
      const data = res.data;

      if (data.token) {
        //Store token and username from backend
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', payload.username);

        // CHANGED: Redirect based on role
        window.location.replace(payload.role === 'admin' ? '/admin' : '/user');
      } else {
        alert(data.message || data.error || 'Login/Register failed');
      }
    } catch (err) {
      console.error(err); // Logging error
      alert('Server error. Check your API URL or backend logs.'); // Friendly error
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>VCM Login / Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={() => handleAuth('login')}>Login</button>
      <button onClick={() => handleAuth('register')}>Register</button>
    </div>
  );
}

export default Login;
