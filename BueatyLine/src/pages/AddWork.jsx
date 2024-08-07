import './AddWork.scss'
import WorkList from '../components/WorkList'
import SearchWork from '../components/SearchWork';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios'

export const handleWorkList = createContext();

const AddWork = () => {
    const [list, setList] = useState([]) // api list
    const accessToken = localStorage.getItem('accessToken'); 
    const [searchValue, setSearchValue] = useState('');

    // api 호출
    const apiList = async () => {
        const url = '/api/work_api/getList';
        const params = {
            sfield : 'member_name',
            skeyword : searchValue
        }
        const response = await axios.get(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        return response.data;
    }
    const getList = async () => {
        try{
            const data = await apiList();
            const listFromApi = data.list;
            setList(listFromApi)
        }catch(error){
            console.error(`Error List: `, error);
        }
    }
    useEffect(() => {
        getList()
    }, [])

    // api 검색
    const searchBtn = async () => {
        try{
            const data = await apiList();
            const searchedList = data.list;
            if(searchedList.length > 0){
                setList(searchedList)
            }
        }catch(error){
            console.error(`Error Occured: `, error);
        }
    }
    // const onChangeInput = (e) => {
    //     setSearchValue(e.target.value)
    // }
    // const checkWord = () => {
    //     searchBtn();
    // }
    useEffect(() => {
        const searchApi = async () => {
            try {
                const data = await apiList();
                const searchedList = data.list
                if(searchedList.length > 0){
                    setList(searchedList)
                    getList(searchValue)
                }
            } catch (error) {
                console.error(`Error list:`, error);
            }
        }
        searchApi()
    }, [searchValue])

    return (
        <handleWorkList.Provider value={{}}>
            <div className='AddWork'>
                <div className='subTitle'>Work List</div>
                <section>
                    <SearchWork 
                        value={searchValue}
                        setValue={setSearchValue}
                        // onChange={onChangeInput}
                        // onClick={checkWork()}
                    />
                </section>
                <section>
                    <WorkList list={list}/>
                </section>
            </div>
        </handleWorkList.Provider>
    )
}

export default AddWork;