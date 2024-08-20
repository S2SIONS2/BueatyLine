import { useEffect, useState } from 'react'
import './CategoryWork.scss'

const CategoryWork = ({category_name, category_cha, category_price, onClose, getChaValue}) => {
    // 가격 변경 시 수정될 금액
    const [price, setPrice] = useState()
    const onChangePrice = (e) => {
        setPrice(e.target.value)
    }

    // 버튼 클릭 시 해당 버튼 value 값 담고 active 클래스 추가
    const [activeIndex, setActiveIndex] = useState(null); // 버튼 class 핸들링
    const [btnValue, setBtnValue] = useState(1) // value 초기값 1

    const getBtnValue = (e, index) => { // 버튼 클릭 시
        setBtnValue(e.target.value)
        setActiveIndex(index)
    }
    useEffect(() => {
        
    }, [btnValue])
    const pushValues = (value) => {
        getChaValue(value)
        // 팝업 닫기
        onClose()
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