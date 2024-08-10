import { useEffect  } from "react"

const WorkList = ({ list }) => {
    // 작업 내역이 여러개일때
    const checkCategoryArray = (list) => {
        // const arr = list[0].categories_name
        // console.log(arr)
        console.log(list)
    }

    useEffect(() => {
        checkCategoryArray(list)
    }, [list])

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
                                <li>{item.categories_name} {item.cha_values}차</li>
                                <li>{item.work_du_date}</li>
                                <li>{item.idx_kmc_member}</li>
                                <li>{item.work_price_completed}</li>
                                <li>{item.work_price_completed}</li>
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