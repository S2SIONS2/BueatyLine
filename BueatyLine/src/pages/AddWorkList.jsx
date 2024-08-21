import './AddWorkList.scss';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import CategoryWork from '../components/CategoryWork';

const AddWorkList = () => {
    // 카테고리 api 호출

    const [list, setList] = useState([]); // api list를 담을 state
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값

    const categoryApiList = async () => {
        try {
            const url = '/api/work_api/getCategory';
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('error:', error);
        }
    };

    const getCategoryList = async () => {
        try {
            const data = await categoryApiList();
            if (data && data.work_category) {
                const listFromApi = data.work_category;
                setList(listFromApi);
                setIsChecked(Array(listFromApi.length).fill(false)); // 각각의 체크 박스 가시적 표시를 위한 state 배열 값 (초기화: false)
                setCategoryModal(Array(listFromApi.length).fill(false)); // 각각의 작업 체크 모달 핸들링 state 배열 값
            }
        } catch (error) {
            console.error('error:', error);
        }
    };

    // 작업 등록
    // 작업 날짜 
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [workDate, setWorkDate] = useState(formattedDate || '');

    
    const changeWorkDate = (e) => {
        setWorkDate(e.target.value);
    };

    // 작업 내역
    // 작업 이름값
    const [categoryName, setCategoryName] = useState([])
    const getCategoryName = (data) => {
        setCategoryName(data)
    }

    // 작업 차수값
    const [chaValues, setChaValues] = useState([]) 
    const getChaValue = (data) => {
        // setChaValues({
        //     ...chaValues,
        //     data: [...(chaValues.data || []), ...data]
        // });
        setChaValues(data)
    }

    // 작업 가격
    const [price, setPrice] = useState([])
    const getCategoryPrice = (data) => {
        setPrice(data)
    }

    // 작업(카테고리) 선택 체크
    const [isChecked, setIsChecked] = useState([]); // 체크 O/X 표시
    const [categoryModal, setCategoryModal] = useState([]); // 작업 선택을 위한 카테고리 모달

    const onChangeCheck = (e, index) => {
        setIsChecked(prevState => { // 각각의 checkbox 체크 상태
            const newState = [...prevState];
            newState[index] = e.target.checked;
            return newState;
        });

        setCategoryModal(prevState => { // 각각의 checkbox 모달
            const newState = [...prevState];
            newState[index] = !prevState[index];
            return newState;
        });
    };
    // 
    const checkCloseBtn = (data) => {
        setIsChecked(data)
    }

    useEffect(() => {
        checkCloseBtn(isChecked)
    }, [isChecked])

    // 고객명 입력
    const [customerName, setCustomerName] = useState('');
    const changeName = (e) => {
        setCustomerName(e.target.value);
    };

    // 결제 완료 체크
    const [activePay, setActivePay] = useState(false); // 버튼 class 핸들링
    const [payValue, setPayValue] = useState(0)
    const activePayBtn = () => {
        setActivePay(true)
    }
    const inActivePayBtn = () => {
        setActivePay(false)
    }
    const getPayValue = () => {
        if(activePay === true) {
            setPayValue(1)
        }
        if(activePay === false) {
            setPayValue(0)
        }
    };

    // 작업 완료 체크
    const [activeWork, setActiveWork] = useState(false); // 버튼 class 핸들링
    const [workValue, setWorkValue] = useState(0)
    const activeWorkBtn = () => {
        setActiveWork(true)
    }
    const inActiveWorkBtn = () => {
        setActiveWork(false)
    }
    const getWorkValue = () => {
        if(activeWork === true) {
            setWorkValue(1)
        }
        if(activeWork === false) {
            setWorkValue(0)
        }
    };
    useEffect(() => {
        getPayValue()
        getWorkValue()
    }, [activePay, activeWork])

    // 메모 입력
    const [memo, setMemo] = useState('');
    const changeMemo = (e) => {
        setMemo(e.target.value);
    };

    // 작업 내역 등록 api
    const addWorkApiList = async () => {
        try{
            const url = '/api/work_api/add';
            let params = {
                // work_idx: '',
                work_date: workDate, // 작업 날짜
                categories_name : categoryName, // 작업명
                cha_values: chaValues, // 작업 차수
                prices: price, // 가격
                idx_kmc_member: customerName, // 고객이름
                work_price_completed: payValue, // 결제 완료(1) / 미완료 표시(0) 
                work_completed: workValue, // 작업 완료(1) / 미완료 표시(0) 
                work_memo: memo // 메모
            }
            const response = await axios.post(url, {
                params: params,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            console.log('날짜 ' + workDate)
            console.log('카테고리명 ' + categoryName)
            console.log('차수 ' + chaValues)
            console.log('고객명 ' + customerName)
            console.log('결제 완료 ' + payValue)
            console.log('작업 완료 ' + workValue)
            console.log('메모 ' + memo)
            // 입력 성공 시
            if(response.data.code === 200) {
                <Link to="/app/work">뒤로가기</Link>
            }
            return response.data;
        }catch(error){
            console.error(error);
            console.log('날짜 ' + workDate)
            console.log('카테고리명 ' + categoryName)
            console.log('차수 ' + chaValues)
            console.log('고객명 ' + customerName)
            console.log('결제 완료 ' + payValue)
            console.log('작업 완료 ' + workValue)
            console.log('메모 ' + memo)
        }
    }

    useEffect(() => {
        getCategoryList();
    }, []);
    
    return (
        <div className="AddWorkList position-relative">
            <div className='subTitle'>Work List 등록</div>
            <div>
                <section className='mb-4'>
                    <h6 className='fw-bold'>작업 날짜</h6>
                    <input type="date" className='w-100' value={workDate} onChange={changeWorkDate} />
                </section>
                <section className='mb-4'>
                    <h6 className='fw-bold'>작업 내역</h6>
                    <div className='row flex-direction-column mb-3'>
                        {list.map((item, index) => (
                            <div key={index} className='border-bottom border-1 pt-1 pb-1'>
                                <label>
                                    <input
                                        type='checkbox'
                                        className='me-2'
                                        checked={isChecked[index] || false}
                                        onChange={(e) => onChangeCheck(e, index)}
                                    /> {item.category_name}
                                </label>
                                {categoryModal[index] &&
                                    <CategoryWork
                                        category_name = {item.category_name}
                                        category_cha = {item.category_cha}
                                        category_price = {item.category_price}
                                        getCategoryName = {getCategoryName}
                                        getChaValue = {getChaValue}
                                        getCategoryPrice = {getCategoryPrice}
                                        onClose={() => onChangeCheck({ target: { checked: false } }, index)}
                                        onConfirmClose={() => onChangeCheck({ target: { checked: true } }, index)}
                                        checkCloseBtn = {checkCloseBtn}
                                    />
                                }
                            </div>
                        ))}
                    </div>
                        {
                            isChecked &&
                            <article className='mb-4'>
                                <h6 className='fw-bold'>작업 내역 확인</h6>
                                <div className='row align-items-center w-auto p-0 m-0'>
                                    <div className='w-auto p-0 me-1'>{categoryName}</div>
                                    <div className='badge rounded-pill bg-info d-block w-auto'>{chaValues}차</div>
                                </div>
                                <div>
                                    가격: {price}원
                                </div>
                            </article>
                        }
                </section>
                <section className='mb-4'>
                    <div className='row flex-direction-column'>
                        <h6 className='fw-bold'>고객</h6>
                        <input type='search' value={customerName} onChange={changeName} />
                    </div>
                </section>
                <section className='mb-4'>
                    <h6 className='fw-bold'>결제 완료</h6>
                    <div className='row mb-3'>
                        <button type='button' className={`w-50 p-0 ${activePay === true ? 'active' : ''}`} onClick={activePayBtn}>완료</button>
                        <button type='button' className={`w-50 p-0 ${activePay === false ? 'active' : ''}`} onClick={inActivePayBtn}>미완료</button>
                    </div>
                    <h6 className='fw-bold'>작업 완료</h6>
                    <div className='row'>
                        <button type='button' className={`w-50 p-0 ${activeWork === true ? 'active' : ''}`} onClick={activeWorkBtn}>완료</button>
                        <button type='button' className={`w-50 p-0 ${activeWork === false ? 'active' : ''}`} onClick={inActiveWorkBtn}>미완료</button>
                    </div>
                </section>
                <section className='mb-4'>
                    <div className='row'>
                        <h6 className='fw-bold'>메모</h6>
                        <textarea value={memo} onChange={changeMemo}></textarea>
                    </div>
                </section>
                <section className='mt-4'>
                    <div className='row'>
                        <button type='button' className='active' onClick={addWorkApiList}>등록하기</button>
                        <button type='button'>
                            <Link to="/app/work">뒤로가기</Link>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AddWorkList;
