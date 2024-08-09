const WorkList = ({list, value}) => {
    return (
        <div className="WorkList">
            {value}
            {
                list.map((item, index) => (
                    <div key={index} className="row align-items-center">
                        {item.member_name}
                    </div>
                )) 
            }
        </div>
    )
}

export default WorkList;