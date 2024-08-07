// import { useState } from 'react'

const SearchDate = ({searchValue, setSearchValue}) => {

    const onChangeInput = (e) => {
        setSearchValue(e.target.value)
    }
    // const checkWord = () => {
    //     searchBtn();
    // }

    return(
        <div className="SearchDate">
            <div className="row align-items-center justify-content-center flex-nowrap mb-2">
                <input type="date" className="col-5"/>
                <span className="w-auto col-1"> ~ </span>
                <input type="date"  className="col-5"/>
            </div>
            <div className="row align-items-center justify-content-center gap-3 mb-3">
                <button type="button" className="btn w-auto text-center light-orange">이전달</button>
                <button type="button" className="btn w-auto text-center light-orange">다음달</button>
            </div>
            <div className="row align-items-center flex-nowrap gap-2 mb-2">
                <select className="w-auto">
                    <option value={"name"}>이름</option>
                    <option value={"phone"}>전화번호</option>
                </select>
                <div className="row align-items-center">
                    <input type="text" className="w-auto" value={searchValue} onChange={onChangeInput}/>
                    <button type="button" className="btn w-auto">검색</button>
                </div>
            </div>
            <div className="row align-items-center gap-2 mb-2">
                {/* <button type="button">전화번호 동기화</button> */}
                
                <button type="button" className="btn w-auto">테이블 형식으로 보기</button>
                <button type="button" className="btn w-auto">접기</button>
                <button type="button" className="btn w-auto">미수금 내역</button>

                <button type="button" className="btn w-auto">등록</button>
                <button type="button" className="btn w-auto">작업완료</button>
            </div>
        </div>
    )
}

export default SearchDate;