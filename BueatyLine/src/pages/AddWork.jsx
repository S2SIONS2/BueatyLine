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
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값
    const [searchValue, setSearchValue] = useState(''); // 검색 input 값
    const [checkList, setCheckList] = useState(null) // 리스트 존재 여부 체크
    const [loading, setLoading] = useState(true); // 로딩중인지 체크
    const [selectOption, setSelectOption] = useState('') // 검색용 selectOption
    const [sfield, setSfield] = useState('member_name')

    // api 호출
    const apiList = async () => {
        try{
            const url = '/api/work_api/getList';
            const params = {
                sfield : sfield,
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

    // select 분류
    const onChangeOption = (e) => {
        setSelectOption(e.target.value)
    }
    const getSelectOption = () => {
        if(selectOption == "name"){
            console.log('name')
            setSfield('mamber_name')
        }

        if(selectOption == "phone"){
            console.log('phone')
            setSfield('member_phone')
        }
    }

    useEffect(() => {
        getSelectOption()
    })

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
                <button className='w-100 mb-3' type="button" onClick={checkOS}>전화번호 동기화</button>
                <section className='p-2 mb-3'>
                    <SearchWork            
                        setSearchValue={setSearchValue}
                        onChangeOption={onChangeOption}
                        selectOption={selectOption}
                        // onClick={checkWork()}
                    />
                </section>
                <section className='p-2'>
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