import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faPen } from "@fortawesome/free-solid-svg-icons";

const WorkList = ({ list }) => {

    return (
        <div className="WorkList">
            <div className="row align-items-center direction-column">
            {
                list.map((item, index) => (
                    <div key={index} className="row align-items-center">
                        <details>
                            <summary>
                                <label>
                                    <input type="checkbox" /> {item.member_name}
                                </label>
                                <span> {item.work_date} </span>
                                <button className='modifyBtn'>
                                    {/* {onClick={() => openListModal(index)} } */}
                                    <FontAwesomeIcon icon={faPen} /> 
                                </button>
                            </summary>
                            <ul>
                                <li>
                                    <div> 
                                        {item.categories_name.split(',').map((name, index) => (
                                            <div key={index} className="row align-items-center">
                                                <span className="w-auto">
                                                    {index}. {name}
                                                </span>
                                                <span className="badge rounded-pill bg-info d-block ml-2 w-auto">
                                                    {item.cha_values.split(',')[index]}차
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    </li>
                                <li>다음 작업 예정일: {item.work_du_date}</li>
                                <li>메모: {item.work_memo === undefined ? '등록된 메모가 없습니다.' : item.work_memo}</li>
                                <li className="row justify-content-start">금액: 
                                    <div className="w-auto p-0">
                                        {item.prices.split(',').map(price => parseInt(price, 10)).reduce((acc, cur) => {return acc + cur}, 0)}
                                    </div>
                                    <div className="w-auto">
                                        - {item.work_price_completed === 0 ? '미결제' : '결제 완료'}
                                    </div>
                                </li>
                                <li>작업: {item.work_price_completed === 0 ? '작업 진행 중' : '작업 완료'}</li>
                            </ul>
                        </details>
                    </div>
                )) 
            }
            </div>
        </div>
    )
}

export default WorkList;