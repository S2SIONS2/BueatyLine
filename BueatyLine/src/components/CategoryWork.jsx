import { useEffect, useState } from 'react'
import './CategoryWork.scss'

const CategoryWork = ({
        category_name, // 부모에게 전달받은 각 인덱스 모달에 뜰 카테고리 명
        category_idx, // 카테고리 이름 idx
        category_cha, // 카테고리 차수
        category_price, // 가격
        getCategoryName, // 부모에게 전달 할 카테고리 명
        getCategoryNameIdx, // 전달할 카테고리 idx
        getChaValue, // 부모에게 전달할 차수
        getCategoryPrice, // 부모에게 전달할 가격
        getNextWorkDate, // 전달할 작업 예정일 
        onClose, // 닫기 버튼 클릭 시
        onConfirmClose, // 확인 버튼 클릭 시
    }) => {
    // 가격 변경 시 수정될 금액
    const [price, setPrice] = useState(category_price || 0)
    const onChangePrice = (e) => {
        setPrice(e.target.value)
    }

    // 버튼 클릭 시 해당 버튼 value 값 담고 active 클래스 추가
    const [activeIndex, setActiveIndex] = useState(0); // 버튼 class 핸들링
    const [btnValue, setBtnValue] = useState(1) // value 초기값 1

    // 버튼 클릭 시
    const getBtnValue = (e, index) => { 
        const value = e.target.value || e.currentTarget.value;
        setBtnValue(value)
        setActiveIndex(index)
    }

    // 카테고리 명 전달
    const getName = (category_name) => {
        getCategoryName(category_name)
    }

    // 카테고리 idx 전달
    const getNameIdx = (category_idx) => {
        getCategoryNameIdx(category_idx)
    }

    // 가격 전달
    const getPrice = (price) => {
        getCategoryPrice(price)
    }
    // 다음 작업 예정일 전달
    const today = new Date();
    const formattedNextDate = `${today.getFullYear()}-${String(today.getMonth() + 2).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [nextWorkDate, setNextWorkDate] = useState([formattedNextDate || ''])
    const changeNextWorkDate = (e) => {
        setNextWorkDate(e.target.value);
    };
    
    // 확인 버튼 클릭 시
    const pushValues = () => {
        // 카테고리 명 전달
        getName(category_name)
        // 카테고리 명 idx 전달
        getNameIdx(category_idx)
        // 차수 값 전달
        getChaValue(btnValue)
        // 가격 전달
        getPrice(price)
        // 작업 예정일 전달
        getNextWorkDate(nextWorkDate)
        // 팝업 닫기
        onConfirmClose()
    }

    return (
        <div className="CategoryWork p-3">
            <article className='mb-3'>
                <span className='mb-1 d-block fw-bold'>{category_name}</span>
                <div className='row align-items-center p-0 m-0'>
                    {
                    [...Array(category_cha)].map((_, index) => (
                            <button type='button' 
                                className={`w-auto p-0 ${activeIndex === index ? 'active' : ''}`}  
                                key={index} 
                                value={index + 1}
                                onClick={(e) => getBtnValue(e, index)}
                            >
                                {index + 1} 차
                            </button>
                    ))
                    }
                </div>
            </article>
            <article className='mb-3'>
                <span className='mb-1 d-block fw-bold'>{category_name} 시술 비용</span>
                <input className='w-100' type='number' value={price} placeholder={category_price || ''} onChange={onChangePrice}/>
            </article>
            <article className='mb-3 p-0 m-0'>
                {
                    btnValue >= 2 && (
                        <div className='row align-items-center p-0 m-0'>
                            <span className='fw-bold p-0 mb-1'>다음 작업 예정일</span>
                            <input type='date' className='w-100 m-0' value={nextWorkDate} onChange={changeNextWorkDate}/>
                        </div>
                    )
                }
            </article>
            <div className='btn_wrap row gap-1 p-0 m-0 mt-4'>
                <button type='button' className='w-50' onClick={onClose}>닫기</button>
                <button type='button' className='w-50 active' onClick={pushValues}>확인</button>
            </div>
        </div>
    )
}

export default CategoryWork