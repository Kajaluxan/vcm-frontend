import { useState,useEffect } from 'react';
import { api } from '../api'; 

function monitorDevTools(callback) {
  let threshold = 160; // ms
  let interval = setInterval(() => {
    const start = performance.now();
    debugger; // DevTools open → takes longer to resume
    const time = performance.now() - start;
    if (time > threshold) {
      callback();
    }
  }, 1000);

  return () => clearInterval(interval); // Cleanup
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

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
        setPopupMessage(data.message || data.error || 'Login/Register failed');
        setTimeout(() => setPopupMessage(''), 3000);
      }
    } catch (err) {
      console.error(err); // Logging error
      setPopupMessage('Login/Register failed.');
      setTimeout(() => setPopupMessage(''), 3000);
      }
  };

  useEffect(() => {
    const handleSecurityBreach = () => {
      alert('Security Violation Detected! Logging out...');
      logout();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSecurityBreach();
      }
    };

    const handleBlur = () => {
      handleSecurityBreach();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    const stopMonitor = monitorDevTools(handleSecurityBreach);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      stopMonitor(); // stop DevTools detection loop
    };
  }, []);

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

      {/* ✅ Popup message */}
      {popupMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          zIndex: 9999
        }}>
          {popupMessage}
        </div>
      )}

    </div>
  );
}

export default Login;
