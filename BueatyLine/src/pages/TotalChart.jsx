import { useEffect, useState } from 'react';
import axios from 'axios';
import './TotalChart.scss';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TotalChart = () => {
    // 날짜 검색
    const [preMonth, setPreMonth] = useState('');
    const [nextMonth, setNextMonth] = useState('');

    const changePreMonth = (e) => {
        setPreMonth(e.target.value);
    }
    const changeNextMonth = (e) => {
        setNextMonth(e.target.value);
    }

    // 차트용 리스트 호출
    const [totalList, setTotalList] = useState({});
    const [list, setList] = useState([]); // api list용
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값

    const getChartApi = async () => {
        try {
            const url = '/api/work_api/getChart';
            const params = {
                sdate: preMonth,
                edate: nextMonth
            };
            const response = await axios.get(url, {
                params: params,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = response.data;
            setTotalList({
                total_cnt: data.total_cnt,
                total_price: data.total_price,
            });
            setList(data.list);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getChartApi();
    }, [preMonth, nextMonth]);

    return (
        <div className='TotalChart'>
            <div className='subTitle'>통계 차트</div>
            <section className='row align-items-center mb-3'>
                <h6 className='fw-bold'>기간: </h6>
                <div className='row align-items-center m-0 gap-1 flex-nowrap'>
                    <input type='date' className='w-50' value={preMonth} onChange={changePreMonth} />
                    <input type='date' className='w-50' value={nextMonth} onChange={changeNextMonth} />
                </div>
            </section>
            <section className='row mb-3 chartArea'>
                <h6 className='fw-bold'>총 예상 결과</h6>
                <div className='row flex-column'>
                    <div className='row align-items-center'>
                        <span className='w-auto'>금액: </span>
                        <div>{totalList.total_price}원</div>
                        <div>※ 외상 포함 금액입니다.</div>
                    </div>
                    <div className='row align-items-center'>
                        <span>인원</span>
                        <div>{totalList.total_cnt}명</div>
                        <div>※ 한 사람이 2개 시술 시 2사람으로 산정됩니다.</div>
                    </div>
                </div>
            </section>
            <section className='row mb-3 chartArea'>
                {/* 시술 별 총 금액*/}
                <h6 className='w-100 text-center fw-bold'>시술 별 총 금액</h6>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={list}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sum_prices" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </section>
            <section className='row mb-3 chartArea'>
                {/* 시술 별 총 인원*/}
                <h6 className='w-100 text-center fw-bold'>시술 별 총 인원</h6>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={list}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cnt" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </section>
            <section className='row flex-column m-0 mb-3 chartArea'>
                { /* 총 예상 금액 */}
                <h6 className='w-100 text-center fw-bold'>총 예상 금액</h6>
                <div className='row align-items-center flex-nowrap m-0 g-0 border'>
                    <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 border-end'>시술명</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1 border-end'>총 금액</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>총 인원</div>
                </div>
                {
                    list.map((item, index) => (
                        <div key={index} className='row align-items-center flex-nowrap m-0 g-0 border'>
                            <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 border-end row'>
                                <div className='mb-1'>{item.category_name}</div>
                            </div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1 border-end'>
                                <div className='mb-1'>{item.sum_prices}원</div>
                            </div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.cnt}명</div>
                        </div>
                    ))
                }
            </section>
            <section className='row flex-column m-0 mb-3 chartArea'>
                { /* 외상 금액 */}
                <h6 className='w-100 text-center fw-bold'>외상 금액</h6>
                <div className='row align-items-center flex-nowrap m-0 g-0 border'>
                    <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 border-end'>시술명</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1 border-end'>완료</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>외상</div>
                </div>
                {
                    list.map((item, index) => (
                        <div key={index} className='row align-items-center flex-nowrap m-0 g-0 border'>
                            <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 border-end row'>
                                <div className='mb-1'>{item.category_name}</div>
                                <div>[{item.sum_prices}]</div>
                            </div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1 border-end'>{item.sum_prices_ok}</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.sum_prices_fail}</div>
                        </div>
                    ))
                }
            </section>
            <section className='row flex-column m-0 mb-3 chartArea'>
                {/* 작업 완료 내역 */}
                <h6 className='w-100 text-center fw-bold'>작업 완료 내역</h6>
                <div className='row align-items-center flex-nowrap m-0 g-0 border'>
                    <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 border-end'>시술명</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1 border-end'>완료</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>미완료</div>
                </div>
                {
                    list.map((item, index) => (
                        <div key={index} className='row align-items-center flex-nowrap m-0 g-0 border'>
                            <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 border-end'>{item.category_name}</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1 border-end'>{item.work_completed_ok}</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.work_completed_fail}</div>
                        </div>
                    ))
                }
            </section>
        </div>
    );
}

export default TotalChart;
