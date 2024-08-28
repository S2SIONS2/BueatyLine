import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const WorkList = ({ list, checkInputOnTab, getList }) => {

    // details 태그 버튼 컨트롤
    const [openDetails, setOpenDetails] = useState(true)
    const toggleDetails = () => {
        setOpenDetails(!openDetails);
      };

    // 미수금 내역 검색
    const [onTab, setOnTab] = useState(false) // 기본값, 외상일 때

    const onChangeCheck = (e) => {
        setOnTab(e.target.checked)
        checkInputOnTab(e.target.checked)
    }
    
    // 작업 완료 추가
    const [isChecked, setIsChecked] = useState([])
    const onChangeWorkCheck = (e, index) => {
        setIsChecked(prevState => { // 각각의 checkbox 체크 상태
            const newState = [...prevState];
            newState[index] = e.target.checked;
            return newState;
        });
    }

    // 수정 api
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값
    const modifyWork = async (index) => {
        try{
            const url = '/api/work_api/updateCompleted';
            let param = {
                idx: [list[index].work_idx],
                work_completed : 1
            }
            const response = await axios.get(url, {
                params: param,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if(response.data.code === 200) {
                getList()
            }
            // if(response.data.code === 400) {
            //     alert()
            //     // console.log(response.data.message)
            // }

        }catch(error){
            console.error(error)
        }
    }

    useEffect(() => {
        modifyWork()
    }, [])
    
    const completeWork = () => {
        isChecked.forEach((checked, index) => {
            console.log(isChecked[index].checked)
            if(checked) {
                modifyWork(index)
                return ;
            }
            if(!checked || checked == null || isChecked == undefined) {
                alert('변경할 작업 내역이 없습니다.')
            }
        })
    }

    return (
        <div className="WorkList p-0 m-0">
            <div className="row align-items-center justify-content-between gap-2 m-0 mb-2">               
                <label className="w-auto m-0 p-0">
                    <input type="checkbox" checked={onTab} onChange={onChangeCheck}/> 미수금 내역
                </label>
                <div className="row align-items-center w-auto">
                    <button type="button" className="btn w-auto me-2">
                        <Link to="/app/addworklist">등록</Link>
                    </button>
                    <button type="button" className="btn w-auto" onClick={completeWork}>작업완료</button>
                </div>
            </div>

            <div className="row align-items-center direction-column m-0 p-0">
            <button onClick={toggleDetails} className="m-0 pt-2 pb-2 rounded-0">
                {openDetails ? '리스트 닫기' : '리스트 열기'}
            </button>
            {
                list.map((item, index) => (
                    <div key={index} className="row align-items-center m-0 p-2 border-bottom border-2 list">
                        { // 작업 완료가 안됐을 때 리스트
                            item.work_completed === 0 &&
                            <details open={openDetails} className="p-0">
                                <summary>
                                    <div className="row align-items-center justify-content-between">
                                        <div className="row align-items-center w-auto">
                                            <span className="w-auto text-muted"><FontAwesomeIcon icon={faChevronDown} /></span>
                                            <span className="w-auto p-0">
                                                <label>
                                                    <input type="checkbox" 
                                                        className="me-2"
                                                        checked={isChecked[index] || false} 
                                                        onChange={(e) => onChangeWorkCheck(e, index)}
                                                    /> {item.member_name}
                                                </label>
                                            </span>
                                            <span className="w-auto"> {item.work_date} </span>
                                        </div>
                                        <button className='modifyBtn bg-transparent modifyBtn w-auto' onClick={() => alert('개발 중 입니다.')}>
                                            {/* {onClick={() => openListModal(index)} } */}
                                            <FontAwesomeIcon icon={faPen} /> 
                                        </button>
                                    </div>
                                </summary>
                                <ul className="m-o p-2">
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">
                                        <div> 
                                            {item.categories_name.split(',').map((name, index) => (
                                                <div key={index} className="row align-items-center">
                                                    <span className="w-auto p-0 me-2">
                                                        {index}. {name}
                                                    </span>
                                                    <span className="badge rounded-pill bg-info d-block w-auto">
                                                        {item.cha_values.split(',')[index]}차
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        </li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">다음 작업 예정일: {item.work_du_date}</li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">메모: {item.work_memo === undefined ? '등록된 메모가 없습니다.' : item.work_memo}</li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">금액: 
                                        <div className="w-auto p-0">
                                            {item.prices.split(',').map(price => parseInt(price, 10)).reduce((acc, cur) => {return acc + cur}, 0)}
                                        </div>
                                        <div className="w-auto">
                                            - {item.work_price_completed === 0 ? '미결제' : '결제 완료'}
                                        </div>
                                    </li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">
                                        작업: {item.work_completed === 0 ? '작업 진행 중' : '작업 완료'}
                                    </li>
                                </ul>
                            </details>
                        }

                        { // 작업 완료가 됐을 때 리스트
                            item.work_completed === 1 &&
                            <details open={openDetails} className="p-0">
                                <summary>
                                    <div className="row align-items-center justify-content-between">
                                        <div className="row align-items-center w-auto">
                                            <span className="w-auto text-muted"><FontAwesomeIcon icon={faChevronDown} /></span>
                                            <span className="w-auto p-0">
                                                <FontAwesomeIcon icon={faCheck} style={{color: 'green'}}/> {item.member_name}
                                            </span>
                                            <span className="w-auto"> {item.work_date} </span>
                                        </div>
                                        <button className='modifyBtn bg-transparent modifyBtn w-auto'>
                                            {/* {onClick={() => openListModal(index)} } */}
                                            <FontAwesomeIcon icon={faPen} /> 
                                        </button>
                                    </div>
                                </summary>
                                <ul className="m-o p-2">
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">
                                        <div> 
                                            {item.categories_name.split(',').map((name, index) => (
                                                <div key={index} className="row align-items-center">
                                                    <span className="w-auto p-0 me-2">
                                                        {index}. {name}
                                                    </span>
                                                    <span className="badge rounded-pill bg-info d-block w-auto">
                                                        {item.cha_values.split(',')[index]}차
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        </li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">다음 작업 예정일: {item.work_du_date}</li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">메모: {item.work_memo === undefined ? '등록된 메모가 없습니다.' : item.work_memo}</li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">금액: 
                                        <div className="w-auto p-0">
                                            {item.prices.split(',').map(price => parseInt(price, 10)).reduce((acc, cur) => {return acc + cur}, 0)}
                                        </div>
                                        <div className="w-auto">
                                            - {item.work_price_completed === 0 ? '미결제' : '결제 완료'}
                                        </div>
                                    </li>
                                    <li className="row justify-content-start m-0 mb-1 p-0 pb-1 border-bottom">
                                        작업: {item.work_completed === 0 ? '작업 진행 중' : '작업 완료'}
                                    </li>
                                </ul>
                            </details>
                        }
                    </div>
                )) 
            }
            </div>
        </div>
    )
}

export default WorkList;