import { useEffect, useState } from 'react'
import './CategoryWork.scss'

const CategoryWork = ({
        category_name, // 부모에게 전달받은 각 인덱스 모달에 뜰 카테고리 명
        category_cha, // 카테고리 차수
        category_price, // 가격
        getCategoryName, // 부모에게 전달 할 카테고리 명
        getChaValue, // 부모에게 전달할 차수
        getCategoryPrice, // 부모에게 전달할 가격
        onClose, // 닫기 버튼 클릭 시
        onConfirmClose // 확인 버튼 클릭 시
    }) => {
    // 가격 변경 시 수정될 금액
    const [price, setPrice] = useState(category_price || '')
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

    // 가격 전달
    const getPrice = (price) => {
        getCategoryPrice(price)
    }
    
    const pushValues = () => {
        // 카테고리 명 전달
        getName(category_name)
        // 차수 값 전달
        getChaValue(btnValue)
        // 가격 전달
        getPrice(price)
        // 팝업 닫기
        onConfirmClose()
    }

    return (
        <div className="CategoryWork p-3">
            <span>{category_name}</span>
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
            <span>{category_name} 시술 비용</span>
            <input className='w-100' type='number' value={price} placeholder={category_price || ''} onChange={onChangePrice}/>
            <div className='btn_wrap row gap-1 p-0 m-0 mt-4'>
                <button type='button' className='w-50' onClick={onClose}>닫기</button>
                <button type='button' className='w-50 active' onClick={pushValues}>확인</button>
            </div>
        </div>
    )
}

export default CategoryWork