import './AddWorkList.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ModifyWork = () => {
    // 전달 받은 각 api 정보
    const location = useLocation();
    const item = location.state?.item;
    // api 인가용 토큰
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값

    // 작업 성공 시 리스트로 페이지 이동
    const navigate = useNavigate();

    // 작업 수정 및 등록
    // 고객명 입력
    const [customerName, setCustomerName] = useState(item.member_name || ''); // 작업 한 고객 명 검색
    const [serachName, setSearchName] = useState([]); // 검색된 연락처 api 리스트
    const changeName = (e) => {
        setCustomerName(e.target.value);
        setShow(true) // 하단 멤버 리스트 보이게
    };
    const getContactApi = async () => { // 연락처 api
        try {
            const url = '/api/member_api/getList'
            let params = {
                sfield : 'member_name',
                skeyword : customerName,
            }
            const response = await axios.post(url, {}, {
                params: params,
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

            const workIdxList = listFromApi.map(item => item.member_idx);
            setCustomerIdx(workIdxList[0])
        }catch(error){
            console.error(error)
        }
    }

    // 이름 검색 후 확인
    const [customerIdx, setCustomerIdx] = useState()
    const [show, setShow] = useState(false) // 멤버 리스트 show 관리
    const onClickName = (item) => {
        setCustomerIdx(item.member_idx)
        console.log(item.member_idx)
        setShow(false) // 멤버 리스트 닫기
        setCustomerName(item.member_name + ` [${item.member_phone}]`) // input에 클릭한 멤버 이름 보이게
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
        searchNameApi()
    }, [customerName])

    // 작업 날짜 
    const [workDate, setWorkDate] = useState(item.work_date || '');   
    const changeWorkDate = (e) => {
        setWorkDate(e.target.value);
    };

    // 다음 작업 예정일
    const [nextDate, setNextDate] = useState([item.work_du_date || ''])
    const getNextWorkDate = (e) => {
        setNextDate(e.target.value)
    }

    // 메모 입력
    const [memo, setMemo] = useState(item.work_memo || '');
    const changeMemo = (e) => {
        setMemo(e.target.value);
    };

    // 결제 완료 체크
    const [activePay, setActivePay] = useState(item.work_price_completed); // 0 or 1
    const togglePayStatus = (status) => {
        setActivePay(status);
    };

    // 작업 완료 체크
    const [activeWork, setActiveWork] = useState(item.work_completed); // 0 or 1
    const toggleWorkStatus = (status) => {
        setActiveWork(status);
    };
    // 수정 api 호출
    const modifyApi = async () => {
        try{
            const decodedToken = jwtDecode(accessToken); // 회원 아이디용 디코드
            const url = '/api/work_api/add';
            let params = {
                items: {
                    work_idx : item.work_idx, // 작업 idx 값
                    idx_kmc_login: decodedToken.login_idx, // 회원 아아디
                    idx_kmc_member : customerIdx, // 고객 아이디
                    member_name: customerName, // 회원명
                    work_date : workDate, // 작업 날짜
                    work_memo : memo, // 메모
                    work_price_completed: activePay, // 결제 완료 표시 완료(1), 미완(0)
                    work_completed: activeWork, // 작업 완료 표시 완료(1), 미완(0)
                },
                subItems: {
                    idx_kmc_work_category: item.categories_idx, // 각 카테고리 이름 idx 값
                    ctglist_cha: item.cha_values, // 작업 차수
                    ctglist_price: item.price, // 가격
                    ctglist_date: nextDate, // 각 카테고리 2차 작업날
                }
            }
            const response = await axios.post(url, params, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            // 코드 200을 타지 않아 임시적으로 했으나 추후 수정 예정
            alert('수정이 완료 되었습니다.')
            navigate('/app/work')

            if(response.data.code === 200){
                alert('수정이 완료 되었습니다.')
                navigate('/app/work')
            }
        }catch(error){
            console.error(error)
        }
    }

    // 삭제 api 호출
    const deleteApi = async () => {
        try{
            const url = '/api/work_api/del'
            let params = {
                idx : item.work_idx
            }
            const response = await axios.get(url, {
                params: params,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if(response.data.code === 200){
                alert('삭제가 완료 되었습니다.')
                navigate('/app/work')
            }
        }catch(error) {
            console.error(error)
        }
    }
    return (
        <div className="ModifyWork position-relative">
            <div className='subTitle'>Work List 수정</div>
            <div>
                <section className='row align-items-center p-0 m-0 g-0 mb-3 position-relative'>
                    <h6 className='fw-bold'>고객명</h6>
                    <div className='row flex-column p-0 m-0'>
                        <input type='text' value={customerName} onChange={changeName} placeholder={item.member_name}/>
                        <div className='position-absolute bg-white top-100 overflow-auto'>
                            {
                                show && customerName && serachName.map((item, index) => (
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
                <section className='row align-items-center p-0 m-0 g-0 mb-3'>
                    <h6 className='fw-bold'>작업 날짜</h6>
                    <input type='date' value={workDate} onChange={changeWorkDate} className='pe-1 ps-2'/>
                </section>
                    {
                        nextDate && 
                        <section className='row align-items-center p-0 m-0 g-0 mb-3'>
                            <h6 className='fw-bold'>다음 작업 예정일</h6>
                            <input type='date' value={nextDate} onChange={getNextWorkDate} className='pe-1 ps-2'/>
                        </section>
                    }
                <section className='row align-items-center p-0 m-0 g-0 mb-3'>
                    <h6 className='fw-bold'>작업 내역</h6>
                    <div className='row align-items-center border-bottom border-1 pb-1 pt-1 bg-light'>
                        작업 명: {item.categories_name}
                    </div>
                    <div className='row align-items-center border-bottom border-1 pb-1 pt-1 bg-light'>
                        가격: {item.prices}   
                    </div>
                    <div className='row align-items-center border-bottom border-1 pb-1 pt-1 bg-light'>
                        총 가격: {item.sum_prices}
                    </div>
                </section>
                {/* <section className='row align-items-center p-0 m-0 g-0 mb-3'>
                    <div className='row align-items-center flex-column'>
                        <button type='button' >작업 추가하기</button>
                    </div>
                    
                </section> */}
                <section className='row align-items-center p-0 m-0 g-0 mb-3'>
                    <h6 className='fw-bold'>메모</h6>
                    <textarea value={memo} onChange={changeMemo} className='p-1'/>
                </section>

                <section className='mb-4'>
                    <h6 className='fw-bold'>결제 완료</h6>
                    <div className='row mb-3 p-0 m-0'>
                        <button type='button' className={`w-50 p-0 ${activePay === 1 ? 'active' : ''}`} onClick={() => togglePayStatus(1)}>완료</button>
                        <button type='button' className={`w-50 p-0 ${activePay === 0 ? 'active' : ''}`} onClick={() => togglePayStatus(0)}>미완료</button>
                    </div>
                    <h6 className='fw-bold'>작업 완료</h6>
                    <div className='row p-0 m-0'>
                        <button type='button' className={`w-50 p-0 ${activeWork === 1 ? 'active' : ''}`} onClick={() => toggleWorkStatus(1)}>완료</button>
                        <button type='button' className={`w-50 p-0 ${activeWork === 0 ? 'active' : ''}`} onClick={() => toggleWorkStatus(0)}>미완료</button>
                    </div>
                </section>
            </div>
            <section className='row align-items-center flex-column p-0 m-0 g-0'>
                <button type='button' className='mb-2 w-100 active' onClick={() => modifyApi()}>수정</button>
                <button type='button' className='mb-2 w-100' style={{borderLeft: '1px solid #ff7f3e'}} onClick={() => navigate('/app')}>취소</button>
                <button type='button' className='w-100' style={{borderLeft: '1px solid #ff7f3e'}} onClick={() => deleteApi()}>삭제 하기</button>
            </section>
        </div>
    );
};

export default ModifyWork;
