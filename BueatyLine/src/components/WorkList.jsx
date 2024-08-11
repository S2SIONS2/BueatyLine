import { useEffect  } from "react"

const WorkList = ({ list }) => {

    // useEffect(() => {
    //     list.map((item, index) => (
            
    //     ))
    // }, [])
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
                                {/* <li>{item.work_du_date}</li>
                                <li>{item.idx_kmc_member}</li>
                                <li>{item.work_price_completed}</li>
                                <li>{item.work_price_completed}</li> */}
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