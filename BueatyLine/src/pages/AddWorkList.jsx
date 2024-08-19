import './AddWorkList.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryWork from '../components/CategoryWork';

const AddWorkList = () => {
    // 작업일 
    const [workDate, setWorkDate] = useState('');
    const changeWorkDate = (e) => {
        setWorkDate(e.target.value);
    };

    const [list, setList] = useState([]); // api list를 담을 state
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값

    // 카테고리 api 호출
    const categoryApiList = async () => {
        try {
            const url = '/api/work_category_api/getList';
            const params = {
                work_date: workDate,
                idx_kmc_member: '',
                work_memo: '',
                work_price_completed: '',
                work_completed: '',
                cha_values: ''
            };
            const response = await axios.get(url, {
                params: params,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('error:', error);
        }
    };

    const getCategoryList = async () => {
        try {
            const data = await categoryApiList();
            if (data && data.list) {
                const listFromApi = data.list;
                setList(listFromApi);
                setIsChecked(Array(listFromApi.length).fill(false));
                setCategoryModal(Array(listFromApi.length).fill(false));
            }
        } catch (error) {
            console.error('error:', error);
        }
    };

    useEffect(() => {
        getCategoryList();
    }, [workDate]);

    // 작업(카테고리) 선택 체크
    const [isChecked, setIsChecked] = useState([]);
    const [categoryModal, setCategoryModal] = useState([]);

    const onChangeCheck = (e, index) => {
        setIsChecked(prevState => {
            const newState = [...prevState];
            newState[index] = e.target.checked;
            return newState;
        });

        setCategoryModal(prevState => {
            const newState = [...prevState];
            newState[index] = !prevState[index];
            return newState;
        });
    };

    // 고객명 입력
    const [customerName, setCustomerName] = useState('');
    const changeName = (e) => {
        setCustomerName(e.target.value);
    };

    // 메모 입력
    const [memo, setMemo] = useState('');
    const changeMemo = (e) => {
        setMemo(e.target.value);
    };

    return (
        <div className="AddWorkList position-relative">
            <div className='subTitle'>Work List 등록</div>
            <section>
                <span>작업 날짜</span>
                <input type="date" className='w-100' value={workDate} onChange={changeWorkDate} />
            </section>
            <section>
                <div className='row flex-direction-column'>
                    {list.map((item, index) => (
                        <div key={index} className=''>
                            <label>
                                <input
                                    type='checkbox'
                                    checked={isChecked[index] || false}
                                    onChange={(e) => onChangeCheck(e, index)}
                                /> {item.category_name}
                            </label>
                            {categoryModal[index] &&
                                <CategoryWork
                                    category_name={item.category_name}
                                    // cha_values = {item.cha_values}
                                />
                            }
                        </div>
                    ))}
                </div>
            </section>
            <section>
                <div className='row flex-direction-column'>
                    <span>고객</span>
                    <input type='text' value={customerName} onChange={changeName} />
                </div>
            </section>
            <section>
                <span>결제 완료</span>
                <div className='row'>
                    <button type='button' className='w-50'>완료</button>
                    <button type='button' className='w-50'>미완료</button>
                </div>
                <span>작업 완료</span>
                <div className='row'>
                    <button type='button' className='w-50'>완료</button>
                    <button type='button' className='w-50'>미완료</button>
                </div>
            </section>
            <section>
                <div className='row'>
                    <span>메모</span>
                    <textarea value={memo} onChange={changeMemo}>
                    </textarea>
                </div>
            </section>
            <section>
                <div className='row'>
                    <button type='button'>등록하기</button>
                    <button type='button'>뒤로가기</button>
                </div>
            </section>
        </div>
    );
};

export default AddWorkList;
