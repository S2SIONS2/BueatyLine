import { useState } from 'react';

const SearchDate = ({ 
        setSearchValue, // 검색 할 input value 값 부모에 전달
        onPrevDate, // 이전달 버튼 클릭 시 현재 pivotData value를 부모에 전달
        onNextDate, // 다음달 버튼 클릭 시 현재 pivotData value를 부모에 전달
        selectOption, // select option값 부모에 전달 
        onChangeOption, // Select value onChangeHandling
        setSdate, // api 검색을 위한 date(날짜) 조건 중 시작날
        setEdate, // api 검색을 위한 date(날짜) 조건 중 마지막날
        checkWord // 검색 버튼이 클릭될 때 부모로 전달
    }) => {
    const [pivotDate, setPivotDate] = useState(new Date()); // 현재 날짜
    const [prevDate, setPrevDate] = useState(''); // 이전달 state
    const [nextDate, setNextDate] = useState(''); // 다음달 state

    // input value onChange 함수
    const onChangePrev = (e) => {
        const targetValue = e.target.value
        setPrevDate(targetValue);
        onPrevDate(targetValue) 
        setSdate(targetValue)
    }
    const onChangeNext = (e) => {
        const targetValue = e.target.value
        setNextDate(targetValue);
        onNextDate(targetValue)
        setEdate(targetValue)
    }

    // value 'yyyy-mm-dd' 형식으로 변경
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 이전달 버튼 클릭 시
    const onHandlePrev = () => {
        const newPivotDate = new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1, 1);
        setPivotDate(newPivotDate);
        setPrevDate(formatDate(newPivotDate));
        setNextDate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0)));
        // 부모에 값 전달
        onPrevDate(formatDate(newPivotDate)) 
        onNextDate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0))) 
        setSdate(newPivotDate)
        setEdate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0)))
    }
    // 다음 달 버튼 클릭 시
    const onHandleNext = () => {
        const newPivotDate = new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1, 1);
        setPivotDate(newPivotDate);
        setPrevDate(formatDate(newPivotDate));
        setNextDate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0)));
        // 부모에 값 전달
        onPrevDate(formatDate(newPivotDate)) 
        onNextDate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0)))
        setSdate(newPivotDate)
        setEdate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0)))
    }

    // 검색 input onChange 함수
    const onChangeInput = (e) => {
        setSearchValue(e.target.value);
    }

    return (
        <div className="SearchDate">
            <div className="row align-items-center justify-content-center flex-nowrap mb-2">
                <input type="date" className="col-5" value={prevDate} onChange={onChangePrev} />
                <span className="w-auto col-1"> ~ </span>
                <input type="date" className="col-5" value={nextDate} onChange={onChangeNext} />
            </div>
            <div className="row align-items-center justify-content-center gap-3 mb-3">
                <button type="button" className="btn w-auto text-center light-orange" onClick={onHandlePrev}>이전달</button>
                <button type="button" className="btn w-auto text-center light-orange" onClick={onHandleNext}>다음달</button>
            </div>
            <div className="row align-items-center gap-2 m-0">
                <select value={selectOption} onChange={onChangeOption}>
                    <option value={"name"}>이름</option>
                    <option value={"phone"}>전화번호</option>
                </select>
                <div className="row align-items-center justify-content-between p-0 m-0 flex-grow-1 w-auto">
                    <input type="text" className="w-auto flex-grow-1 me-2 mb-2" onChange={onChangeInput} />
                    <button type="button" className="btn w-auto mb-2" onClick={checkWord}>검색</button>
                </div>
            </div>
        </div>
    )
}

export default SearchDate;
