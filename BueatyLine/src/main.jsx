import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Login from "./pages/Login.jsx";
import Contact from './pages/Contact';
import TotalChart from './pages/TotalChart';
import Category from './pages/Category';
import './index.css';
import '../src/scss/style.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} /> {/* 로그인 페이지 라우팅*/}
      <Route path='/app' element={<App />}> {/* 버튼 클릭 후 라우팅 */}
        <Route path='contact' element={<Contact />} />
        <Route path='totalchart' element={<TotalChart />} />
        <Route path='category' element={<Category />} />
        <Route index element={<Category />} /> {/* 기본 경로 */}
      </Route>
      {/* <Route path="*" /> */}
    </Routes>
  </BrowserRouter>
);
