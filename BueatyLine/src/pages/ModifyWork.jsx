import './AddWorkList.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ModifyWork = () => {
    const location = useLocation();
    
    // location.state가 undefined인 경우를 처리하기 위해 안전하게 접근
    const item = location.state?.item;

    return (
        <div className="ModifyWork position-relative">
            {item.categories_idx}
            {item.categories_name}
            {item.work_idx}
            {item.cha_values}
            {item.member_name}
            {item.prices}
            {item.sum_prices}
            {item.work_completed}
            {item.work_date}
            {item.work_du_date}
            {item.work_memo}
            {item.work_price_completed}
        </div>
    );
};

export default ModifyWork;
