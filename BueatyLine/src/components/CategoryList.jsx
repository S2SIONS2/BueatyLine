import './CategoryList.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const CategoryList = () => {
    const [modal, setModal] = useState(false); // 리스트 추가 모달
    const [listModal, setListModal] = useState([]); // 리스트 수정 모달 상태 배열
    const [list, setList] = useState([]); // api 리스트
    const [categoryInput, setCategoryInput] = useState({ // 카테고리 폼 지정
        category_name: '',
        category_price: ''
    });
    const [modifyInput, setModifyInput] = useState({}); // 수정 팝업 input value 처리
    const accessToken = localStorage.getItem('accessToken'); // 인증용 accessToken값 가져오기
    const [searchValue, setSearchValue] = useState(''); // 검색할 input
    const [searchList, setSearchList] = useState('');
    
    // input value 등록
    const onChangeValue = (e) => {
        const { name, value } = e.target;
        setCategoryInput({
            ...categoryInput,
            [name]: value
        });
    }

    // api list 가져옴
    const apiList = async () => {
        const url = '/getList';
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    };

    const getList = async () => {
        try {
            const data = await apiList();
            const listFromApi = data.list;
            setList(listFromApi);
            setListModal(listFromApi.map(() => false)); // 모달 상태 초기화
        } catch (error) {
            console.error(`Error list:`, error);
        }
    };

    useEffect(() => {
        getList();
    }, []); 

    // 확인 버튼 클릭 시
    const addedApi = async () => {
        const category_name = categoryInput.category_name;
        const category_price = categoryInput.category_price;

        // api 입력 실패 시 
        if (category_name === '') {
            alert('카테고리 명을 작성 해주세요.');
            return false;
        }
        if (!category_price) {
            alert('가격을 작성 해주세요.');
            return false;
        }

        // 카테고리 추가 시 api 파라미터 추가
        let params = {
            category_name: category_name,
            category_price: category_price,
            category_sort: 0,
            category_cha: 1,
            parent_id: 0,
        }

        // 추가 api
        const url = '/add';   
        const response = await axios.post(url, params, {      
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // api 입력 성공 시
        if (response.data.code === 200){
            getList();
            setCategoryInput({ category_name: '', category_price: '' });
            setModal(false);
        }
    }

    // 리스트 수정 모달
    const openListModal = (index) => {
        setListModal(listModal.map((modal, i) => (i === index ? !modal : modal)));
    };
    
    const closeListModal = (index) => {
        setListModal(listModal.map((modal, i) => (i === index ? false : modal)));
    };

    // 리스트 삭제 시
    const confirmDeleteValue = async (index) => {
        const idx = list[index].category_idx;
        // 삭제 api
        const url = '/del';
        let params = {
            idx: idx
        };
        const response = await axios.get(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if(response.data.code === 200){
            getList();
            closeListModal(index);
        }
    }

    // 리스트 수정 시
    const confirmModifyValue = async (index) => {
        const idx = list[index].category_idx;
        const category_name = modifyInput[index]?.category_name || list[index].category_name;
        const category_price = modifyInput[index]?.category_price || list[index].category_price;

        // 수정 api
        const url = '/add';
        let params = {
            category_idx: idx,
            parent_id: 0,
            category_name: category_name,
            category_price: category_price,
            category_sort: 0,
            category_cha: 1
        };
        const response = await axios.post(url, params, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // api 입력 실패 시 
        if (category_name === '') {
            alert('카테고리 명을 작성 해주세요.');
            return false;
        }
        if (!category_price) {
            alert('가격을 작성 해주세요.');
            return false;
        }

        // api 수정 성공 시
        if (response.data.code === 200){
            getList();
            closeListModal(index);
        }
    }

    // 수정 모달 내 input 이벤트 핸들링
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

    // api 검색
    const searchApi = async () => {
        try {
            const data = await apiList();
            const searchWords = data.list.map(obj => obj.list).filter(item => item && item.includes(searchValue));
            console.log(searchWords)
            console.log(data) 
        } catch (error) {
            console.error(`Error list:`, error);
        }
    }
    // input 값 변경
    const onChangeInput = (e) => {
        setSearchValue(e.target.value)
    }
    // 리스트 검색
    const checkWord = () => {
        searchApi();
    }
    // 검색 값 변동 시 마다 검색
    useEffect(() => {
        const searchApi = async () => {
            try {
                const data = await apiList();
                const searchedList = data.list
                    .filter(item => {
                        console.log("Filtering item:", item.category_name);
                        return item.category_name && item.category_name.includes(searchValue);
                    });
                if(searchedList.length > 0){
                    console.log(searchedList)
                }
                
                
            } catch (error) {
                console.error(`Error list:`, error);
            }
        }
        searchApi()
    })

    return (
        <div className="CategoryList">
            <div className='row align-items-center justify-content-end w-100 m-0 p-0'>
                <input type='text' className='w-auto mb-3 me-2'
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
                    카테고리 추가
                </button>    
            </div>
            {
                modal &&
                    <div className='modalContainer'>
                        <div className='modalHeader'>카테고리 추가</div>
                        <div className='modalContent'>
                            <div className='addCategoryArea row flex-column' style={{marginLeft: 0, marginRight: 0, marginTop: '10px', marginBottom: '10px'}}>
                                <div className='addCategory'>
                                    <div className='row align-items-center mb-1'>
                                        <div className='col-3'>
                                            시술명 : 
                                        </div>
                                        <div className='col-9 row p-0'>
                                            <input type='text' name='category_name' value={categoryInput.category_name} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                    <div className='row align-items-center'>
                                        <div className='col-3'>
                                            금액 : 
                                        </div>
                                        <div className='col-9 row p-0'>
                                            <input type='number' name='category_price' value={categoryInput.category_price} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='btn_wrap'>
                                <button className='btn-point-dark btn btn_small' 
                                    onClick={addedApi}>
                                    확인
                                </button>
                                <button className='btn-light btn btn_small' onClick={() => setModal(false)}>닫기</button>
                            </div>
                        </div>
                    </div>
            }
            <div className='row flex-column m-0 p-0'>
                <div className='row row-cols-2 align-items-center justify-content-between th p-0 m-0'>
                    <div className='text-center col-5'>시술 명</div>
                    <div className='text-center col-5'>비용</div>
                    <div className='icon'></div>
                </div>
                {
                    list.map((item, index) => (
                        <div key={index} className='row align-items-center justify-content-between td p-0 m-0'>
                            <div className='text-center col-5'>{item.category_name}</div>
                            <div className='text-center col-5'>{item.category_price}₩</div>
                            <div className='icon' onClick={() => openListModal(index)}>
                                <FontAwesomeIcon icon={faPen} /> 
                                {listModal[index] && 
                                    <div className='listModalContainer' onClick={(e) => e.stopPropagation()}>                                                                             
                                        <div className='listModal'>
                                            <div className='row justify-content-end closeIcon row-cols-auto m-0'>
                                                <button type='button' onClick={() => confirmDeleteValue(index)}>
                                                    삭제      
                                                </button>                                                
                                            </div>
                                            <div className='addCategoryArea row flex-column' style={{marginLeft: 0, marginRight: 0, marginTop: '10px', marginBottom: '10px'}}>
                                                <div className='addCategory'>
                                                    <div className='row align-items-center mb-1'>
                                                        <div className='col-3'>
                                                            시술명 : 
                                                        </div>
                                                        <div className='col-9 row'>
                                                            <input type='text' name='category_name' placeholder={item.category_name} value={modifyInput[index]?.category_name || item.category_name} onChange={(e) => onChangeHandle(e, index)}/>
                                                        </div>
                                                    </div>
                                                    <div className='row align-items-center'>
                                                        <div className='col-3'>
                                                            금액 : 
                                                        </div>
                                                        <div className='col-9 row'>
                                                            <input type='number' name='category_price' placeholder={item.category_price} value={modifyInput[index]?.category_price || item.category_price} onChange={(e) => onChangeHandle(e, index)}/>
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
        </div>
    );
};

export default CategoryList;
