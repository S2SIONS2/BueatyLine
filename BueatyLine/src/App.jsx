import './reset.css';
import './App.scss';
import axios from 'axios';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [nav, setNav] = useState(false);
  const [outerWidth, setOuterWidth] = useState(0);
  const bodyRef = useRef(null);
  const navigate = useNavigate();

  // 모바일 화면 사이즈 대응용
  useEffect(() => {
    const updateOuterWidth = () => {
      if (bodyRef.current) {
        setOuterWidth(bodyRef.current.offsetWidth);
      }
    };

    updateOuterWidth();
    window.addEventListener('resize', updateOuterWidth);
    return () => window.removeEventListener('resize', updateOuterWidth);
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.post("/api/login_api/logout", {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.data.code === 200) {
        alert('로그아웃 되었습니다.');
      }
      handleLogout();
    } catch (error) {
      alert(error);
      handleLogout();
    }
  };

  // 새 access토큰 요청
  const getAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post("/api/login_api/refresh_token", {
        'refresh_token': refreshToken
      });
      const newAccessToken = response.data.data.token;
      localStorage.setItem('accessToken', newAccessToken);
    } catch (error) {
      console.error('Error Occurred: ', error);
      alert('로그인이 만료 되었습니다.')
      handleLogout();
    }
  };
  // accessToken 발급을 위한 확인 함수
  const checkAccessToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // access, refresh토큰이 둘 다 없을 때
    if (!accessToken && !refreshToken) {
      alert('로그인이 만료 되었습니다.')
      handleLogout();
      return;
    }

    // access토큰이 있을 때
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const now = Math.floor(Date.now() / 1000);
        if (now > decodedToken.exp) {
          if (refreshToken) {
            await getAccessToken();
          } else {
            alert('로그인이 만료 되었습니다.')
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Token Decode Error: ', error);
        alert('로그인이 만료 되었습니다.')
        handleLogout();
      }
    } else if (refreshToken) {
      await getAccessToken();
    }
  };

  const checkAfterEmpty = async () => {
    await checkAccessToken();
  };

  // url 화면 바뀔 때 마다 실행
  const location = useLocation();
  useEffect(() => {
    checkAfterEmpty();
  }, [location]);

  return (
    <div className="App position-relative" ref={bodyRef}>
      <div className='nav w-100 row align-items-center justify-content-between ps-2 pe-2'>
        <div className='logo row align-items-center w-auto'>
          <Link to="/app">BueaLine</Link>
        </div>
        <div className='wrap row w-auto align-items-center justify-content-end p-0'>
          <button type='button' className='w-auto' onClick={() => setNav(!nav)}>
            <FontAwesomeIcon className='w-auto p-0' icon={faBars} size='2x' />
          </button>
          {nav && (
            <div className='menu row flex-column align-items-end p-0' style={{ width: outerWidth + 'px' }}>
              <Link to="/app/work" onClick={() => setNav(false)}>작업 등록 및 내역</Link>
              <Link to={"/app/totalchart"} onClick={() => setNav(false)}>통계 차트</Link>
              <Link to="/app/category" onClick={() => setNav(false)}>작업 카테고리</Link>
              <Link to="/app/contact" onClick={() => setNav(false)}>주소록</Link>
              <div className='row m-0 p-0'>
                <button className='logoutBtn row justify-content-end p-0 mt-1' onClick={logout}>로그아웃</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
