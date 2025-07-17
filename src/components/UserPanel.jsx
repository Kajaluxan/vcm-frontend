// src/components/UserPanel.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './UserPanel.css';

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

function UserPanel() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [watermarkPosition, setWatermarkPosition] = useState({top: "50%", right: "50%"});
  const playerRef = useRef();
  const containerRef = useRef();
  const username = localStorage.getItem('username');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
    window.location.reload();
  };

  const fetchVideos = async () => {
    const res = await api.get('/videos');
    setVideos(res.data);
  };

  const playVideo = async(filename,fileid) => {
    const res = await api.get(`/video/${fileid}`, 
    );

    const data =  res.data;
    const player = playerRef.current;
    const container = containerRef.current;
    player.src = data.url;
    container.style.display = 'block';
    setTimeout(() => {
      enterFullscreen();
    }, 100);
  };

  const enterFullscreen = () => {
    const elem = containerRef.current;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      const player = playerRef.current;
      const container = containerRef.current;
      player.pause();
      player.currentTime = 0;
      container.style.display = 'none';
    }
  };

  useEffect(() => {
    fetchVideos();

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', exitHandler);
      document.removeEventListener('webkitfullscreenchange', exitHandler);
      document.removeEventListener('mozfullscreenchange', exitHandler);
      document.removeEventListener('MSFullscreenChange', exitHandler);
    };
    
  }, []);

  useEffect(() => {
    const watermarkRenderInterval = setInterval(()=>{
      let topPosition = `${Math.floor(Math.random() * 101)}%`;
      let rightPosition = `${Math.floor(Math.random() * 101)}%`;
      setWatermarkPosition({top: topPosition, right: rightPosition});
    },1000)
    return() => clearInterval(watermarkRenderInterval);
  }, []);

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
    <div className="userpanel-container">
      <div className="userpanel-header">
        <div className="logo-container">
          <img src="\assests\logo.jpeg" alt="VCM Logo" className="logo-centered" />
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
      <div className="section">
        <h3 className="section-title">Available Videos</h3>
        {videos
          .sort((a, b) => a.id - b.id)
          .map((v) => (
            <div key={v.id} className="video-card">
              <div className="video-title">{v.original_name}</div>
              <button className="play-button" onClick={() => playVideo(v.filename, v.id)}>
                ▶ Play
              </button>
            </div>
        ))}
      </div>

      <div
        id="videoContainer"
        ref={containerRef}
        className="fullscreen-container"
      >
        <video
          ref={playerRef}
          controls
          disablePictureInPicture
          controlsList="nodownload nofullscreen picture-in-picture"
          className="fullscreen-video"
        ></video>
        <div key={`${watermarkPosition?.top}-${watermarkPosition?.right}`} style={{top: watermarkPosition?.top, right: watermarkPosition?.right, display: "block !important", oppacity: "100%"}} className="watermark">
          {username}
        </div>
        <button
          onClick={enterFullscreen}
          className="fullscreen-btn"
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}

export default UserPanel;
