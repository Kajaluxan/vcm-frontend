import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
    window.location.reload();
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get('/pending-users');
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Error fetching pending users:", err.message);
    }
  };

   const fetchVideos = async () => {
    try {
      const res = await api.get('/videos');
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err.message);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/all-users');
      setAllUsers(res.data);
    } catch (err) {
      console.error("Error fetching all users:", err.message);
    }
  };

  const approveUser = async (id) => {
    await api.post(`/approve-user/${id}`);
    fetchPendingUsers(); 
    fetchAllUsers();
  };

  const rejectUser = async (id) => {
  await api.delete(`/reject-user/${id}`);
  fetchPendingUsers(); 
  fetchAllUsers();
};


  const uploadVideo = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('video', video);
    await api.post('/upload', form);
    fetchVideos();
  };

  const deleteVideo = async (id) => {
    await api.delete(`/video/${id}`);
    fetchVideos();
  };

  const renameVideo = async (id) => {
    const newName = prompt('New name:');
    if (newName) {
      await api.put(`/video/${id}`, { newName });
      fetchVideos();
    }
  };

  const uploadPdf = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('pdf', pdf); // make sure you have const [pdf, setPdf] = useState(null);
    await api.post('/upload-pdf', form);
    fetchPdfs();
  };

  const deletePdf = async (id) => {
    await api.delete(`/pdf/${id}`);
    fetchPdfs();
  };

  const renamePdf = async (id) => {
    const newName = prompt('New name:');
    if (newName) {
      await api.put(`/pdf/${id}`, { newName });
      fetchPdfs();
    }
  };

  const fetchPdfs = async () => {
    try {
      const res = await api.get('/pdfs');
      setPdfs(res.data); // also define: const [pdfs, setPdfs] = useState([]);
    } catch (err) {
      console.error("Error fetching PDFs:", err.message);
    }
  };


  useEffect(() => {
    fetchPendingUsers();
    fetchVideos();
    fetchAllUsers();
    fetchPdfs();
  }, []);

  return (
    <div className="admin-container centered justified">
      <div className="admin-header">
        <h2 className="admin-title centered-text">Admin Panel</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="section">
        <h3>Pending Users</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>
                  <button className="action-btn accept" onClick={() => approveUser(u.id)}>Approve</button>
                  <button className="action-btn reject" onClick={() => rejectUser(u.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>All Registered Users</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td >
                  <span className={user.approved ? "badge-approved" : "badge-pending"}>
                    {user.approved ? "Approved" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>Upload Video</h3>
        <form className="upload-form" onSubmit={uploadVideo}>
          <input
            className="file-input"
            type="file"
            onChange={e => setVideo(e.target.files[0])}
            required
          />
          <button className="submit-btn" type="submit">Upload</button>
        </form>
      </div>

      <div className="section">
        <h3>Upload PDF</h3>
        <form className="upload-form" onSubmit={uploadPdf}>
          <input
            className="file-input"
            type="file"
            accept="application/pdf"
            onChange={e => setPdf(e.target.files[0])}
            required
          />
          <button className="submit-btn" type="submit">Upload</button>
        </form>
      </div>

      <div className="section">
        <h3>Videos</h3>
        <ul className="list">
          {videos.map(v => (
            <li className="list-item" key={v.id}>
              {v.original_name}
              <div className="action-buttons">
                <button className="btn-delete" onClick={() => deleteVideo(v.id)}>Delete</button>
                <button className="btn-rename" onClick={() => renameVideo(v.id)}>Rename</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>PDF Documents</h3>
        <ul className="list">
          {pdfs.map(p => (
            <li className="list-item" key={p.id}>
              {p.originalName}
              <div className="action-buttons">
                <button className="btn-delete" onClick={() => deletePdf(p.id)}>Delete</button>
                <button className="btn-rename" onClick={() => renamePdf(p.id)}>Rename</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default AdminPanel;
