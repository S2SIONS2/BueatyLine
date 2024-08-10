import './AddWork.scss'
import WorkList from '../components/WorkList'
import SearchWork from '../components/SearchWork';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import NoData from '../components/NoData';
import Loading from '../components/Loading';

export const handleWorkList = createContext();

const AddWork = () => {
    const [list, setList] = useState([]) // api list
    const accessToken = localStorage.getItem('accessToken'); 
    const [searchValue, setSearchValue] = useState('');
    const [checkList, setCheckList] = useState(null)
    const [loading, setLoading] = useState(true);
    // let hasList = false;

    // api 호출
    const apiList = async () => {
        try{
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
            setCheckList(response.data)
            return response.data;
        }
        catch(error){
            console.error(`error:`, error)
        }
        finally{
            setLoading(false)
        }

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

    //안드로이드 앱에서 전화번호 가져옴
    const checkOS = () => {
        const isMobile = /iPhone|Android/i.test(navigator.userAgent);
        if (isMobile) {
          if (!window.confirm("동기화를 진행하시겠습니까? \n 동일한 전화번호가 존재할 경우, 휴대폰의 정보로 갱신됩니다.")) return;
          if (typeof window.Android !== 'undefined') {
            window.Android.syncPhoneBook();
          }
        } else {
          alert('앱에서 실행해주세요');
        }
      };

    if (loading) {
        return (
            <Loading /> // 로딩 중 표시
        )
    }

    if(!checkList){
        return (
            <NoData /> // data가 없을 때
        )
    }

    return (
        <handleWorkList.Provider value={{}}>
            <div className='AddWork'>
                <div className='subTitle'>Work List</div>
                <section>
                    <SearchWork            
                        setSearchValue={setSearchValue}
                        checkOS={checkOS}
                        // onChange={onChangeInput}
                        // onClick={checkWork()}
                    />
                </section>
                <section>
                    <WorkList 
                        list={list}
                        value={searchValue}
                    />
                </section>
            </div>
        </handleWorkList.Provider>
    )
}

export default AddWork;