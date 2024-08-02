import './reset.css';
import './App.scss';
import axios from 'axios';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'

function App() {
  // nav 열고 닫기
  const [nav, setNav] = useState(false);
  const openNav = () => {
    setNav(nav => !nav);
  };

  // nav(menu) 사이즈 지정
  const [outerWidth, setOuterWidth] = useState(0);
  const bodyRef = useRef(null);

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

  // 로그인 페이지로 이동
  const navigate = useNavigate();
  const handleLogout = () => {
      navigate('/'); // 로그인 후 기본 경로
  };

  // 로그아웃 
  const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const logoutResult = await axios.post("/logout", {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if(logoutResult.data.code === 200){
      alert('로그아웃 되었습니다.')
      handleLogout()
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    handleLogout();
  }

  // 액세스 토큰 재발급
  const getAccessToken = async () => {
    try{
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post("/refreshToken", {
          'refresh_token' : refreshToken
      })

      const newAccessToken = response.data.data.token
      localStorage.setItem('accessToken', newAccessToken)
    } catch(error){
      console.log('Error Occured: ', error)
    }
  }

  // 리프레시 토큰 확인
  const checkRefreshToken = async () => {
    const accessToken = localStorage.getItem('accessToken'); 
    const decodeToken = jwtDecode(accessToken) // accessTokenExp 디코드 값
    const now = Math.floor(Date.now() / 1000) // 현재 시간
    
    if(now > decodeToken.exp){
      await getAccessToken();
    }
  } 
  
  const location = useLocation() // 페이지 이동 시에 토큰 확인
  useEffect(() => {
    checkRefreshToken()
  }, [location])

  

  return (
    <div className="App position-relative" ref={bodyRef}>
      <div className='nav w-100 row align-items-center justify-content-between ps-2 pe-2'>
        <div className='logo row align-items-center w-auto'>
          <Link to="/app">BueaLine</Link>
        </div>
        <div className='wrap row w-auto align-items-center justify-content-end p-0'>
          <button type='button' className='w-auto' onClick={openNav}>
            <FontAwesomeIcon className='w-auto p-0' icon={faBars} size='2x' />
          </button>
          {
            nav &&
            <div className='menu row flex-column align-items-end p-0' style={{ width: outerWidth + 'px' }}>
              <Link to="/app/category" onClick={() => setNav(false)}>작업 카테고리</Link>
              {/* <Link to="/app/contact" onClick={() => setNav(false)}>주소록</Link> */}
              {/* <Link to="/app/totalchart" onClick={() => setNav(false)}>통계 차트</Link> */}

              <div className='row m-0 p-0'>
                <button className='logoutBtn row justify-content-end p-0 mt-1' onClick={logout}>로그아웃</button>
              </div>
            </div>
          }
        </div>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
