import './ContactList.scss';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";

const ContactList = () => {
    const [searchValue, setSearchValue] = useState('') // 검색할 Input
    const [modal, setModal] = useState(false); // 리스트 추가 state
    const [contactInput, setContactInput] = useState({
        contact_name: '',
        contact_number: '',
        contact_memo: '',
    })
    const [listModal, setListModal] = useState(false)
    
    // 검색 input value 핸들링
    const onChangeInput = (e) => {
        setSearchValue(e.target.value)
    }

    useEffect(() => {

    }, [searchValue])

    // 전화번호부 추가 
    const onChangeValue = (e) => {
        const { name, value } = e.target
        setContactInput({
            ...contactInput,
            [name]:value
        })
    }

    // 전화번호부 수정 모달 
    const openListModal = () => {
        setListModal(true)
    } 

    return (
        <div className='ContactList'>
            <div className='row align-items-center justify-content-end w-100 m-0 p-0'>
                <input type='text' className='flex-grow-1 w-auto mb-3 me-2'
                    value={searchValue}
                    onChange={onChangeInput}
                />
                <button 
                    className='btn mb-3 w-auto' type='button'
                    // onClick={checkWord}
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
            {
                modal &&
                    <div className='modalContainer'>
                        <div className='modalHeader'>카테고리 추가</div>
                        <div className='modalContent'>
                            <div className='addCategoryArea row flex-column' style={{marginLeft: 0, marginRight: 0, marginTop: '10px', marginBottom: '10px'}}>
                                <div className='addCategory'>
                                    <div className='row align-items-center mb-2'>
                                        <div className='col-4'>
                                            성함 : 
                                        </div>
                                        <div className='col-8 row p-0'>
                                            <input type='text' name='contact_name' value={contactInput.contact_name} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                    <div className='row align-items-center mb-2'>
                                        <div className='col-4'>
                                            전화 번호 : 
                                        </div>
                                        <div className='col-8 row p-0'>
                                            <input type='number' name='contact_number' value={contactInput.contact_number} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                    <div className='row align-items-center'>
                                        <div className='col-4'>
                                            메모 : 
                                        </div>
                                        <div className='col-8 row p-0'>
                                            <input type='number' name='contact_memo' value={contactInput.contact_memo} onChange={onChangeValue}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='btn_wrap row align-items-center justify-content-end'>
                                <button className='btn-point-dark btn btn_small me-2' 
                                    // onClick={addedApi}
                                >
                                    확인
                                </button>
                                <button className='btn-light btn btn_small' onClick={() => setModal(false)}>닫기</button>
                            </div>
                        </div>
                    </div>
            }
            <div className='row flex-column m-0 p-0'>
                <div className='row align-items-center justify-content-start w-100 m-0 p-0 td' onClick={openListModal}>
                    <div className='row align-items-center justify-content-center w-auto m-0 p-0'>
                        <FontAwesomeIcon className='w-auto m-0 pe-2' icon={faAddressBook} />
                    </div>
                    <div className='row align-items-center flex-grow-1 w-auto m-0'>
                        김영희
                    </div>
                    {
                        listModal && 
                        <div className='listModalContainer'>
                            <div className='listModal'>
                                <div className='row justify-content-end closeIcon row-cols-auto m-0'>
                                    <button type='button' 
                                        // onClick={() => confirmDeleteValue(index)}
                                    >
                                        삭제      
                                    </button>                                                
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className='row align-items-center justify-content-start w-100 m-0 p-0 td'>
                    <div className='row align-items-center justify-content-center w-auto m-0 p-0'>
                        <FontAwesomeIcon className='w-auto m-0 pe-2' icon={faAddressBook} />
                    </div>
                    <div className='row align-items-center flex-grow-1 w-auto m-0'>
                        김철수
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactList;
