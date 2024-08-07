const WorkList = ({list}) => {
    return (
        <div className="WorkList">
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