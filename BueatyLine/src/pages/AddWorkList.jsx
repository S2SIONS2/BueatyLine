import './AddWorkList.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import CategoryWork from '../components/CategoryWork';
import { jwtDecode } from 'jwt-decode';

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
        setCategoryName((prev) => [...prev, data])
        // setCategoryName(data)
    }

    // 작업 이름 idx값
    const [categoryNameIdx, setCategoryNameIdx] = useState([])
    const getCategoryNameIdx = (data) => {
        setCategoryNameIdx((prev) => [...prev, data])
    }

    // 작업 차수값
    const [chaValues, setChaValues] = useState([]);
    const getChaValue = (data) => {
        const CtoI = parseInt(data, 10)
        setChaValues((prev) => [...prev, CtoI])
    }

    // 작업 가격
    const [price, setPrice] = useState([])
    const getCategoryPrice = (data) => {
        // setPrice(data)
        const CtoI = parseInt(data, 10)
        setPrice((prev) => [...prev, CtoI])
    }

    // 다음 작업 예정일
    const [nextDate, setNextDate] = useState([])
    const getNextWorkDate = (data) => {
        setNextDate(data)
    }

    // 작업 내역 변수 통합
    const [workGroup, setWorkGroup] = useState([])
    const setGroup = () => {
        setWorkGroup((prev) => [
            ...prev,
            {
                workName: categoryName || '',
                workChaValue: chaValues || '',
                workPrice: price || ''
            }
        ]);
    };

    useEffect(() => {
        setGroup()
        console.log(workGroup)
    }, [categoryName, chaValues, price])

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
        console.log(workGroup)
    }, [isChecked])

    // 고객명 입력
    const [customerName, setCustomerName] = useState(''); // 작업 한 고객 명 검색
    const [serachName, setSearchName] = useState([]); // 검색된 연락처 api 리스트
    const changeName = (e) => {
        setCustomerName(e.target.value);
    };
    const getContactApi = async () => { // 연락처 api
        try {
            const url = '/api/member_api/getList'
            const response = await axios.post(url, {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data
        }catch(error){
            console.error(error)
        }
    }
    const getContactList = async () => { // 연락처 api 호출
        try{
            const data = await getContactApi()
            const listFromApi = data.list
            setSearchName(listFromApi)
        }catch(error){
            console.error(error)
        }
    }

    // 이름 검색 후 확인
    const [customerIdx, setCustomerIdx] = useState()
    const onClickName = (item) => {
        setCustomerIdx(item.member_idx)
        
    }

    useEffect(() => {
        const searchNameApi = async () => {
            try {
                const data = await getContactApi()
                const searchedList = data.list
                if(searchedList.length > 0){
                    getContactList(customerName)
                }
            }catch(error) {
                console.error(error)
            }
        }
        // getContactList()
        searchNameApi()
    }, [customerName])

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
    const navigate = useNavigate(); // 작업 후 페이지 이동
    const addWorkApiList = async () => {
        try{
            const decodedToken = jwtDecode(accessToken); // 회원 아이디용 디코드
            const url = '/api/work_api/add';
            let params = {
                items: {
                    // work_idx: 0,
                    idx_kmc_login: decodedToken.login_idx, // 회원 아이디
                    idx_kmc_member: customerIdx, // 고객 아이디
                    work_date: workDate, // 작업 날짜
                    member_name: customerName, // 고객이름
                    work_price_completed: payValue, // 결제 완료(1) / 미완료 표시(0) 
                    work_completed: workValue, // 작업 완료(1) / 미완료 표시(0) 
                    work_memo: memo // 메모
                },
                subItems: {
                    idx_kmc_work_category: categoryNameIdx, // 각 카테고리 이름 idx 값
                    ctglist_cha: chaValues, // 작업 차수
                    ctglist_price: price, // 가격
                    ctglist_date: nextDate, // 각 카테고리 2차 작업날
                }
            }
            const response = await axios.post(url, params, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            // 입력 성공 시
            if(response.data.code === 200) {
                navigate('/app/work');
            }
            return response.data;
        }catch(error){
            console.error(error);
        }
    }

    useEffect(() => {
        getCategoryList(); // 작업 추가 api
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
                                        category_idx = {item.category_idx}
                                        category_price = {item.category_price}
                                        getCategoryName = {getCategoryName}
                                        getCategoryNameIdx = {getCategoryNameIdx}
                                        getChaValue = {getChaValue}
                                        getCategoryPrice = {getCategoryPrice}
                                        getNextWorkDate = {getNextWorkDate}
                                        onClose={() => onChangeCheck({ target: { checked: false } }, index)}
                                        onConfirmClose={() => onChangeCheck({ target: { checked: true } }, index)}
                                        checkCloseBtn = {checkCloseBtn}
                                    />
                                }
                            </div>
                        ))}
                    </div>
                    <div>
                        <h6 className='fw-bold'>작업 내역 확인</h6>
                        {
                            <article className='row align-items-center p-0 m-0'>
                                <div className='row flex-column align-items-center p-0 col-5 ellipsis g-0'>
                                    {
                                        categoryName.map((item, index) => (
                                            <div className='p-0 mb-2' key={index}>{item}</div>
                                        ))
                                    }
                                </div>
                                <div className='row flex-column align-items-center p-0 col-2 g-0'>
                                    {
                                        chaValues.map((item, index) => (
                                        <div key={index} className='badge rounded-pill bg-info w-auto text-nowrap row flex-nowrap m-0 mb-2'>{item}차</div>
                                    ))
                                    }
                                </div>
                                <div className='row flex-column align-items-center justify-content-center text-center p-0 col-4 g-0'>
                                    {
                                        price.map((item, index) => (
                                            <div className='mb-2' key={index}>{item}</div>
                                        ))
                                    }
                                </div>
                                <div className='row flex-column align-items-center justify-content-center p-0 col-1 g-0'>
                                    {
                                        categoryName.map((index) => (
                                            <button key={index} type='button' className='h-auto text-center mb-2'>X</button>
                                        ))
                                    }
                                </div>
                            </article>
                        }
                    </div>
                        
                </section>
                <section className='mb-4 position-relative'>
                    <h6 className='fw-bold'>고객</h6>
                    <div className='row flex-direction-colum p-0 m-0'>
                        <input type='search' value={customerName} onChange={changeName} />
                        <div className='position-absolute bg-white top-100 overflow-auto'>
                            {
                                customerName && serachName.map((item, index) => (
                                    <div key={index} className='row align-items-center mt-2 border-bottom pt-1 pb-1 w-100 cursor-pointer' onClick={() => onClickName(item)} style={{cursor: 'pointer'}}>
                                        <div className='w-auto'>
                                            {item.member_name}
                                        </div>
                                        <div className='w-auto p-0'>
                                            {item.member_phone}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className='mb-4'>
                    <h6 className='fw-bold'>결제 완료</h6>
                    <div className='row mb-3 p-0 m-0'>
                        <button type='button' className={`w-50 p-0 ${activePay === true ? 'active' : ''}`} onClick={activePayBtn}>완료</button>
                        <button type='button' className={`w-50 p-0 ${activePay === false ? 'active' : ''}`} onClick={inActivePayBtn}>미완료</button>
                    </div>
                    <h6 className='fw-bold'>작업 완료</h6>
                    <div className='row p-0 m-0'>
                        <button type='button' className={`w-50 p-0 ${activeWork === true ? 'active' : ''}`} onClick={activeWorkBtn}>완료</button>
                        <button type='button' className={`w-50 p-0 ${activeWork === false ? 'active' : ''}`} onClick={inActiveWorkBtn}>미완료</button>
                    </div>
                </section>
                <section className='mb-4'>
                    <div className='row p-0 m-0'>
                        <h6 className='fw-bold'>메모</h6>
                        <textarea value={memo} onChange={changeMemo}></textarea>
                    </div>
                </section>
                <section className='mt-4'>
                    <div className='row p-0 m-0'>
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
