import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Login from "./pages/Login.jsx";
import Contact from './pages/Contact';
import TotalChart from './pages/TotalChart';
import Category from './pages/Category';
import AddWork from "./pages/AddWork.jsx";
import NoData from "./components/NoData.jsx";
import AddWorkList from './pages/AddWorkList'
import './index.css';
import '../src/scss/style.scss';
import ModifyWork from "./pages/ModifyWork.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} /> {/* 로그인 페이지 라우팅*/}
      <Route path='/app' element={<App />}> {/* 버튼 클릭 후 라우팅 */}
        <Route index element={<AddWork />} /> {/* 기본 경로 */}
        <Route path='category' element={<Category />} />
        <Route path='contact' element={<Contact />} />
        <Route path='work' element={<AddWork />} />
        <Route path='totalchart' element={<TotalChart />} />
        <Route path="addworklist" element={<AddWorkList />} />
        <Route path="modifywork" element={<ModifyWork />} />
      </Route>
      <Route path="*" element={<NoData />} /> {/* 404 not found */}
    </Routes>
  </BrowserRouter>
);
