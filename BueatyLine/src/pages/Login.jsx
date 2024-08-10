import './Login.scss';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // 로그인 인풋 폼
    const [user, setUser] = useState({
        userId: 'user1',
        userPw: 1111
    })
    const onChangeHandle = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    // 로그인 버튼 클릭 시 화면 이동
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/app'); // 로그인 후 기본 경로
    };

    // 엔터 키로 로그인 하기
    const handleBtn = async (e) => {
        if(e.key === 'Enter'){
            await loginInfo()
        }
    }

    // login jwt 구현
    // 1. 로그인 정보 보내기
    const loginInfo = async () => {
        const loginResult = await axios.post("/api/login_api/login", {
            login_id: user.userId,
            login_pw: user.userPw 
        })
        if (loginResult.data.code === 200) {
            const accessToken = loginResult.data.data.token
            const refreshToken = loginResult.data.data.refresh_token
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            handleLogin() // 로그인 후 화면 전환
        } else {
            alert('등록되지 않은 아이디이거나 아이디 혹은 비밀번호가 맞지 않습니다.')
        }
    }

    return(
        <div className="Login">
            <div className='loginWrap pt-1 position-relative'>
                <div className='loginTitle row align-items-center justify-content-center mb-5 mt-5'>BueaLine</div>
                <div className='loginContent p-4'>
                    <div className='row flex-column m-0 p-0'>
                        <input type='text' className='mb-2' name='userId' value={user.userId} onChange={onChangeHandle} onKeyDown={handleBtn} placeholder='ID'/>
                        <input type='password' className='mb-4' name='userPw' value={user.userPw} onChange={onChangeHandle} onKeyDown={handleBtn} placeholder='PassWord'/>
                        <button type='button' className='confirmLogin btn' onClick={loginInfo}>Login</button>
                    </div>
                    {/* <div className='row align-items-center justify-content-end'>
                        <button type='button' className='joinBtn w-auto mt-1'>
                            <a href='/'>회원가입</a>
                        </button>
                    </div> */}
                </div>
            </div>    
        </div>
    )
}

export default Login;