import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';

function App() {
  const getPayload = () => {
    const token = localStorage.getItem('token');
    try {
      return token ? JSON.parse(atob(token.split('.')[1])) : null;
    } catch {
      return null;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            getPayload()?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
          }
        />
        <Route
          path="/user"
          element={
            getPayload()?.role === 'user' ? <UserPanel /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
