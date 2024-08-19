import './ContactList.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faPen } from "@fortawesome/free-solid-svg-icons";

const ContactList = () => {
    const [searchValue, setSearchValue] = useState(''); // 검색할 입력값
    const [modal, setModal] = useState(false); // 연락처 추가 모달 상태
    const [contactInput, setContactInput] = useState({
        member_group: '',
        member_name: '',
        member_phone: '',
        member_memo: '',
    });
    const [listModal, setListModal] = useState([]); // 연락처 수정 모달 상태
    const [list, setList] = useState([]); // API에서 가져온 연락처 리스트
    const accessToken = localStorage.getItem('accessToken'); // localStorage에서 가져온 accessToken
    const [modifyInput, setModifyInput] = useState({})

    // API 리스트 호출 함수
    const apiList = async () => {
        const url = '/api/member_api/getList';
        const params = {
            sfield: 'member_name',
            skeyword: searchValue
        };
        const response = await axios.get(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    };
    // list에 연락처 리스트 담기
    const getList = async () => {
        try {
            const data = await apiList();
            const listFromApi = data.list;
            setList(listFromApi);
            setListModal(listFromApi.map(() => false)); // 모달 상태 초기화
        } catch (error) {
            console.error(`Error List: `, error);
        }
    };

    useEffect(() => {
        getList()
    }, [])

    // 리스트 추가
    const addApi = async () => {
        const member_group = contactInput.member_group;
        const member_name = contactInput.member_name;
        const member_phone = contactInput.member_phone;
        const member_memo = contactInput.member_memo;

        // api 추가 파라미터
        let params = {
            member_group: member_group,
            member_name: member_name,
            member_phone: member_phone,
            member_memo: member_memo,
        }

        // 추가 api 호출
        const url = '/api/member_api/add';
        const response = await axios.post(url, params, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        // api 추가 실패 시
        if(!member_group){
            alert('그룹 명을 작성 해주세요.');
            return false;
        }
        if(!member_name){
            alert('이름을 작성 해주세요.');
            return false;
        }
        if(!member_phone){
            alert('전화번호를 작성 해주세요.');
            return false;
        }
        if(!member_memo){
            alert('메모를 작성 해주세요.');
            return false;
        }

        // api 입력 성공 시
        if(response.data.code === 200){
            getList()
            setContactInput({
                member_group: '',
                member_name: '',
                member_phone: '',
                member_memo: ''
            })
            setModal(false)
        }
        if(response.data.code === 300){
            alert('이미 등록된 전화번호 입니다.')
        }
    }

    // 연락처 입력값 변경
    const onChangeValue = (e) => {
        const { name, value } = e.target;
        setContactInput({
            ...contactInput,
            [name]: value
        });
    };

    // 연락처 수정 모달 열기/닫기
    const openListModal = (index) => {
        setListModal(listModal.map((modal, i) => (i === index ? !modal : modal)));
    };
    
    const closeListModal = (index) => {
        setListModal(listModal.map((modal, i) => (i === index ? false : modal)));
    };

    // 리스트 수정 시
    const confirmModifyValue = async (index) => {
        const idx = list[index].member_idx;
        const member_group = modifyInput[index]?.member_group || list[index].member_group;
        const member_name = modifyInput[index]?.member_name || list[index].member_name;
        const member_phone = modifyInput[index]?.member_phone || list[index].member_phone;
        const member_memo = modifyInput[index]?.member_memo || list[index].member_memo;

        // 수정 api
        const url = '/api/member_api/add';
        let params = {
            member_idx: idx,
            parent_id: 0,
            member_group: member_group,
            member_name: member_name,
            member_phone: member_phone,
            member_memo: member_memo,
            orderSort: 0,
            member_cha: 1
        };
        const response = await axios.post(url, params, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // api 수정 실패 시 
        if(!member_group){
            alert('그룹 명을 작성 해주세요.');
            return false;
        }
        if(!member_name){
            alert('이름을 작성 해주세요.');
            return false;
        }
        if(!member_phone){
            alert('전화번호를 작성 해주세요.');
            return false;
        }
        // if(!member_memo){
        //     alert('메모를 작성 해주세요.');
        //     return false;
        // }

        // api 수정 성공 시
        if (response.data.code === 200){
            getList();
            closeListModal(index);
        }
    }

    // 수정 모달 내 카테고리 name, price input 이벤트 핸들링
    const onChangeHandle = (e, index) => {
        const { name, value } = e.target;
        setModifyInput({
            ...modifyInput,
            [index]: {
                ...modifyInput[index],
                [name]: value
            }
        });
    }

    // api 삭제
    const confirmDeleteValue = async (index) => {
        const idx = list[index].member_idx;

        // 삭제 api 호출
        const url = '/api/member_api/del'
        let param = {
            idx: idx
        }
        const response = await axios.get(url, {
            params: param,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        if(response.data.code === 200){
            getList();
            closeListModal(index)
        }
    }

    // api 검색
    const searchBtn = async () => {
        try{
            const data = await apiList();
            const searchedList = data.list;
            if(searchedList.length > 0){
                setList(searchedList)
            }
        }catch (error){
            console.error(`Error list: `, error)
        }
    }
    // input 값 변경
    const onChangeInput = (e) => {
        setSearchValue(e.target.value)
    }
    // 리스트 검색
    const checkWord = () => {
        searchBtn()
    }
    // 검색 값 변동 시 마다 재검색
    useEffect(() => {
        const searchApi = async () => {
            try {
                const data = await apiList();
                const searchedList = data.list;
                if(searchedList.length > 0){
                    setList(searchedList)
                    getList(searchValue)
                }
            }catch(error) {
                console.error(`Error Occured: `, error)
            }
        }
        searchApi()
    }, [searchValue])

    return (
        <div className='ContactList'>
            <div className='row align-items-center justify-content-end w-100 m-0 p-0'>
                <input type='text' className='flex-grow-1 w-auto mb-3 me-2'
                    value={searchValue}
                    onChange={onChangeInput}
                />
                <button 
                    className='btn mb-3 w-auto' type='button'
                    onClick={checkWord}
                >
                    검색
                </button>    
            </div>
            <div className='row align-items-center justify-content-end w-100 m-0 p-0'>
                <button 
                    className='openModal btn mb-3 w-auto' type='button'
                    onClick={() => setModal(true)}
                >
                    연락처 추가
                </button>    
            </div>
            {/* 추가 모달 */}
            {
                modal && 
                    <div className='modalContainer'>
                        <div className='modalHeader'>연락처 추가</div>
                        <div className='modalContent'>
                            <div className='addCategoryArea row flex-column' style={{marginLeft: 0, marginRight: 0, marginTop: '10px', marginBottom: '10px'}}>
                                <div className='addCategory'>
                                    <div className='row align-items-center mb-2'>
                                        <div className='col-4 text-nowrap'>
                                            그룹
                                        </div>
                                        <div className='col-8 row p-0'>
                                            <input type='text' name='member_group' value={contactInput.member_group} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                    <div className='row align-items-center mb-2'>
                                        <div className='col-4 text-nowrap'>
                                            이름
                                        </div>
                                        <div className='col-8 row p-0'>
                                            <input type='text' name='member_name' value={contactInput.member_name} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                    <div className='row align-items-center mb-2'>
                                        <div className='col-4 text-nowrap'>
                                            전화 번호
                                        </div>
                                        <div className='col-8 row p-0'>
                                            <input type='number' name='member_phone' value={contactInput.member_phone} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                    <div className='row align-items-center'>
                                        <div className='col-4 text-nowrap'>
                                            메모
                                        </div>
                                        <div className='col-8 row p-0'>
                                            <input type='text' name='member_memo' value={contactInput.member_memo} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='btn_wrap row align-items-center justify-content-end'>
                                <button className='btn-point-dark btn btn_small me-2' onClick={addApi}>
                                    확인
                                </button>
                                <button className='btn-light btn btn_small' onClick={() => setModal(false)}>닫기</button>
                            </div>
                        </div>
                    </div>
            }
            {/* 연락처 리스트 */}
            {
                list.map((item, index) => (
                    <div key={index} className='row align-items-center justify-content-between td p-0 m-0'>
                        <div className='row align-items-center justify-content-center col-1 m-0 p-0'>
                            <FontAwesomeIcon className='w-auto m-0 pe-2' icon={faAddressBook} />
                        </div>
                        <div className='col-3 ellipsis'>{item.member_group}</div>
                        <div className='col-6 ellipsis'>{item.member_name}</div>
                        <div className='icon col-2 text-center'>
                            <button onClick={() => openListModal(index)} className='modifyBtn'>
                                <FontAwesomeIcon icon={faPen} /> 
                            </button>
                            {/* 연락처 수정 모달 */}
                            {
                                listModal[index] && 
                                <div className='listModalContainer'>
                                    <div className='listModal'>
                                        <div className='row justify-content-end closeIcon row-cols-auto m-0'>
                                            <button type='button' onClick={() => confirmDeleteValue(index)}>
                                                삭제      
                                            </button>                                                
                                        </div>
                                        <div className='addCategoryArea row flex-column' style={{marginLeft: 0, marginRight: 0, marginTop: '10px', marginBottom: '10px'}}>
                                            <div className='addCategory'>
                                                <div className='row align-items-center mb-1'>
                                                    <div className='col-4 text-nowrap text-start'>
                                                        그룹
                                                    </div>
                                                    <div className='col-8 row'>
                                                        <input type='text' name='member_group' placeholder={item.member_group} value={modifyInput[index]?.member_group} onChange={(e) => onChangeHandle(e, index)}/>
                                                    </div>
                                                </div>
                                                <div className='row align-items-center mb-1'>
                                                    <div className='col-4 text-nowrap text-start'>
                                                        이름
                                                    </div>
                                                    <div className='col-8 row'>
                                                        <input type='text' name='member_name' placeholder={item.member_name} value={modifyInput[index]?.member_name} onChange={(e) => onChangeHandle(e, index)}/>
                                                    </div>
                                                </div>
                                                <div className='row align-items-center mb-1'>
                                                    <div className='col-4 text-nowrap text-start'>
                                                        전화 번호
                                                    </div>
                                                    <div className='col-8 row'>
                                                        <input type='number' name='member_phone' placeholder={item.member_phone} value={modifyInput[index]?.member_phone} onChange={(e) => onChangeHandle(e, index)}/>
                                                    </div>
                                                </div>
                                                <div className='row align-items-center mb-1'>
                                                    <div className='col-4 text-nowrap text-start'>
                                                        메모
                                                    </div>
                                                    <div className='col-8 row'>
                                                        <input type='text' name='member_memo' placeholder={item.member_memo} value={modifyInput[index]?.member_memo} onChange={(e) => onChangeHandle(e, index)}/>
                                                    </div>
                                                </div>
                                                <div className='row align-items-cneter mb-1'>
                                                    <div className='col-4 text-nowrap text-start'>
                                                        생성일
                                                    </div>
                                                    <div className='col-8 row'>
                                                        <input type='text' name='created_at' placeholder={item.created_at} value={contactInput.created_at} readOnly />
                                                    </div>
                                                </div>         
                                            </div>
                                        </div>
                                        <div className='btn_wrap'>
                                            <button type='button' className='btn btn-point-dark' onClick={() => confirmModifyValue(index)}>확인</button>
                                            <button type='button' className='btn btn-light' onClick={() => closeListModal(index)}>닫기</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default ContactList;
