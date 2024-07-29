import {useState} from 'react';

const Ex = () => {
    const [inputValue, setInputValue] = useState([{
        // name: ''
    }])


    const addContent = () => {
        setInputValue([...inputValue, {} ])
    }

    // const handleChange = (index, e) => {
    //     const {name, value} = e.target
    //     const newInputValue = [...inputValue]
    //     newInputValue[index][name] = value;
    //     setInputValue(newInputValue);
    // }

    const deleteCategory = (index) => {
        const newInputValues = inputValue.filter((_, i) => i !== index);
        setInputValue(newInputValues)
        // setForm({
        //     ...form,
        //     count: form.count - 1
        // })
    }
    return (
        <div className="Ex">
            <button onClick={addContent}>addContent</button>
            {
                inputValue.map((item, index) =>(
                    <div key={index}>
                        element
                        <button type='button' onClick={() => deleteCategory(index)}>삭제</button>
                    </div>
                    // <div key={index}>
                    //     {/* <input className='input' 
                    //         type='text'
                    //         name='name'
                    //         // value={item.name}
                    //         // onChange={(e) => handleChange(index,e)}
                    //     /> */}   
                    // </div>
                ))
            }
        </div>
    )
}

export default Ex;