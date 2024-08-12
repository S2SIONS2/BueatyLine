const SearchDate = ({ setSearchValue, checkOS }) => {

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
            <div className="row align-items-center gap-2 m-0 mb-2">
                <select>
                    <option value={""}>분류</option>
                    <option value={"name"}>이름</option>
                    <option value={"phone"}>전화번호</option>
                </select>
                <div className="row align-items-center justify-content-between p-0 m-0 flex-grow-1 w-auto">
                    <input type="text" className="w-auto flex-grow-1 me-2" onChange={onChangeInput}/>
                    <button type="button" className="btn w-auto">검색</button>
                </div>
            </div>
        </div>
    )
}

export default SearchDate;