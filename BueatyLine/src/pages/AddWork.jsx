import './AddWork.scss'
import WorkList from '../components/WorkList'
import SearchWork from '../components/SearchWork';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import NoData from '../components/NoData';
import Loading from '../components/Loading';

export const handleWorkList = createContext();

const AddWork = () => {
    const [checkList, setCheckList] = useState(null) // 리스트 존재 여부 체크
    const [loading, setLoading] = useState(true); // 로딩중인지 체크

    const [list, setList] = useState([]) // api list를 담을 state
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값
    const [sdate, setSdate] = useState() // api 검색 용 시작일
    const [edate, setEdate] = useState() // api 검색 용 마지막일
    const [selectOption, setSelectOption] = useState('') // 검색용 select Option
    const [searchValue, setSearchValue] = useState(''); // 검색 input 값
    const [sfield, setSfield] = useState('member_name') // sfield 초기화

    // api 호출
    const apiList = async () => {
        
        try{
            const url = '/api/work_api/getList';
            let params = {
                sfield : sfield,
                skeyword : searchValue,
                sdate: sdate,
                edate: edate,
            }
            if(isChecked === true) {
                params.work_price_completed = 0
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
  
    // api 검색   
    const searchApi = async () => {
        try{
            const data = await apiList();
            if(data.totalCount > 0){
                const listFromApi = data.list;
                setList(listFromApi)
            }
        }catch(error){
            console.error(`Error List: `, error);
        }
    }
    useEffect(() => {
        searchApi()
    }, [searchValue])

    // 날짜 분류 검색
    const [prevDate, setPrevDate] = useState(''); // 자식 컴포넌트 이전달 state
    const [nextDate, setNextDate] = useState(''); // 자식 컴포넌트 다음달 state

    const onHandlePrevDate = (data) => {
        setPrevDate(data)
        setSdate(data)
    }
    const onHandleNextDate = (data) => {
        setNextDate(data)
        setEdate(data)
    }

    // useEffect(() => {   
    //     getList();
    // },[prevDate, nextDate])

    // select 분류 검색
    const onChangeOption = (e) => {
        setSelectOption(e.target.value)
    }
    const getSelectOption = () => {
        if(selectOption == "name"){
            setSfield('member_name')
        }

        if(selectOption == "phone"){
            setSfield('member_phone')
        }
    }
    useEffect(() => {
        getSelectOption()
    }, [selectOption])


    // 검색 버튼 클릭 시 
    const checkWord = () => {
        if(prevDate >= nextDate){
            return(
                alert('시작 일은 종료 일보다 크거나 같을 수 없습니다.')
            )
        }
        searchApi() // 검색어 입력 확인
        // searchDate() // 변경된 날짜 확인
        getSelectOption() // 셀렉트 타입 확인
        getList()
    }

    // checkbox 리스트 보기
    const [isChecked, setIsChecked] = useState(false) // 미수금내역 체크박스 확인
    const checkInputOnTab = (data) => {
        setIsChecked(data)
    }

    useEffect(() => {
        getList()
    }, [prevDate, nextDate, isChecked])

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
                        onPrevDate={onHandlePrevDate}
                        onNextDate={onHandleNextDate}
                        setSearchValue={setSearchValue}
                        onChangeOption={onChangeOption}
                        selectOption={selectOption}
                        setSdate={setSdate}
                        setEdate={setEdate}
                        checkWord={checkWord}
                    />
                </section>
                <section className='p-2'>
                    <WorkList 
                        list={list}
                        value={searchValue}
                        checkInputOnTab={checkInputOnTab}

                    />
                </section>
            </div>
        </handleWorkList.Provider>
    )
}

export default AddWork;