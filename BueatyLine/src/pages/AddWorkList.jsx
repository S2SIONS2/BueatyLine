import './AddWorkList.scss';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import CategoryWork from '../components/CategoryWork';

const AddWorkList = () => {
    // 작업일 
    const [workDate, setWorkDate] = useState('');
    const changeWorkDate = (e) => {
        setWorkDate(e.target.value);
    };

    const [list, setList] = useState([]); // api list를 담을 state
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값

    // 카테고리 api 호출
    const categoryApiList = async () => {
        try {
            const url = '/api/work_api/getCategory';
            // const params = {
            //     work_date: workDate,
            //     idx_kmc_member: '',
            //     work_memo: '',
            //     work_price_completed: '',
            //     work_completed: '',
            //     cha_values: ''
            // };
            const response = await axios.get(url, {
                // params: params,
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

    // 작업 내역 등록 api
    const [chaValues, setChaValues] = useState() // 차수값
    const getChaValue = (data) => {
        setChaValues(data)
    }
    const addWorkApiList = async () => {
        try{
            const url = '/api/work_api/add';
            let params = {
                work_idx: '',
                work_date: workDate,
                idx_kmc_member: customerName,
                cha_values: chaValues,
                prices: '',
                work_memo: '',
                work_price_completed: '',
                work_completed: ''
            }
            const response = await axios.get(url, {
                params: params,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            console.log('날짜 ' + workDate)
            console.log('차수 ' + chaValues)
            return response.data;
        }catch(error){
            console.error(error);
            console.log('날짜 ' + workDate)
            console.log('차수 ' + chaValues)
        }
    }

    useEffect(() => {
        getCategoryList();
    }, []);

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
        getChaValue()
        console.log(chaValues)
        checkCloseBtn(isChecked)
    }, [isChecked])

    // 고객명 입력
    const [customerName, setCustomerName] = useState('');
    const changeName = (e) => {
        setCustomerName(e.target.value);
    };

    // 메모 입력
    const [memo, setMemo] = useState('');
    const changeMemo = (e) => {
        setMemo(e.target.value);
    };

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
                    <div className='row flex-direction-column'>
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
                                        checkCloseBtn = {checkCloseBtn}
                                        onClose={() => onChangeCheck({ target: { checked: false } }, index)}
                                        getChaValue = {getChaValue}
                                    />
                                }
                            </div>
                        ))}
                    </div>
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
                        <button type='button' className='w-50 active'>완료</button>
                        <button type='button' className='w-50'>미완료</button>
                    </div>
                    <h6 className='fw-bold'>작업 완료</h6>
                    <div className='row'>
                        <button type='button' className='w-50'>완료</button>
                        <button type='button' className='w-50 active'>미완료</button>
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
