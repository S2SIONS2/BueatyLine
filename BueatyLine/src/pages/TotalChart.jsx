import { useEffect, useState } from 'react';
import axios from 'axios';
import './TotalChart.scss';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell ,Customized } from 'recharts';

const TotalChart = () => {
    // 날짜 검색
    const [pivotDate, setPivotDate] = useState(new Date()); // 현재 날짜
    const [preDate, setPreDate] = useState('');
    const [nextDate, setNextDate] = useState('');

    const changePreDate = (e) => {
        setPreDate(e.target.value);
    }
    const changeNextDate = (e) => {
        setNextDate(e.target.value);
    }
    // value 'yyyy-mm-dd' 형식으로 변경
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 이전달 버튼 클릭 시
    const onHandlePrev = () => {
        const newPivotDate = new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1, 1);
        setPivotDate(newPivotDate);
        setPreDate(formatDate(newPivotDate));
        setNextDate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0)));
    }
    // 다음 달 버튼 클릭 시
    const onHandleNext = () => {
        const newPivotDate = new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1, 1);
        setPivotDate(newPivotDate);
        setPreDate(formatDate(newPivotDate));
        setNextDate(formatDate(new Date(newPivotDate.getFullYear(), newPivotDate.getMonth() + 1, 0)));
    }

    // 차트용 리스트 호출
    const [totalList, setTotalList] = useState({});
    const [list, setList] = useState([]); // api list용
    const accessToken = localStorage.getItem('accessToken'); // api 인가용 aceessToken값

    const getChartApi = async () => {
        try {
            const url = '/api/work_api/getChart';
            const params = {
                sdate: preDate,
                edate: nextDate
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

    // 차트 각각 개별 색상 적용
    const colors = ['#BAF2E9', '#BAD7F2', '#D6C9DE', '#F2BAC9', '#F2E2BA', '#293241', '#ee6c4d', '#5b8e7d', '#4c443c', '#b191ff']

    // 차트 타입 두가지
    // 1. 세로 막대형
    const [barGraph, setBarGraph] = useState(true)
    const onlBarGraph = () => {
        setBarGraph(true)
        setCircleGraph(false)
    }

    // 2. 원형 차트
    const [circleGraph, setCircleGraph] = useState(false)
    const onCircleGraph = () => {
        setCircleGraph(true)
        setBarGraph(false)
    }

    useEffect(() => {
        getChartApi();
    }, [preDate, nextDate]);

    return (
        <div className='TotalChart'>
            <div className='subTitle'>Total Chart</div>
            <section className='row align-items-center justify-content-center mb-3 g-0'>
                <h6 className='fw-bold'>기간: </h6>
                <div className='row align-items-center justify-content-center m-0 gap-1 flex-nowrap mb-2'>
                    <input type='date' className='col-5' value={preDate} onChange={changePreDate} />
                    <span className="w-auto col-1"> ~ </span>
                    <input type='date' className='col-5' value={nextDate} onChange={changeNextDate} />
                </div>
                <div className="row align-items-center justify-content-center gap-3 mb-3 p-0">
                    <button type="button" className="btn w-auto text-center light-orange" onClick={onHandlePrev}>이전달</button>
                    <button type="button" className="btn w-auto text-center light-orange" onClick={onHandleNext}>다음달</button>
                </div>
            </section>
            <section className='row mb-3 chartArea g-0'>
                <h6 className='w-100 text-center fw-bold'>총 예상 결과</h6>
                <div className='row flex-column'>
                    <div className='row align-items-center mb-2'>
                        <span className='w-auto'>금액: </span>
                        <div className='w-auto'>{totalList.total_price}원</div>
                        <div className='ps mt-1'>※ 외상 포함 금액입니다.</div>
                    </div>
                    <div className='row align-items-center'>
                        <span className='w-auto'>인원</span>
                        <div className='w-auto'>{totalList.total_cnt}명</div>
                        <div className='ps mt-1'>※ 한 사람이 2개 시술 시 2사람으로 산정됩니다.</div>
                    </div>
                </div>
            </section>
            <div className='row align-items-center gap-2 flex-nowrap mb-2'>
                <button type='button' value={barGraph} className='flex-fill' onClick={onlBarGraph}>바 그래프</button>
                <button type='button' value={circleGraph} className='flex-fill' onClick={onCircleGraph}>원형 그래프</button>
            </div>
            {
                barGraph && 
                <div className='row flex-column g-0'>
                    <section className='row mb-3 chartArea g-0'>
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
                                <XAxis 
                                    dataKey="category_name" 
                                    tickFormatter={(value) => value} 
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sum_prices">
                                    {list.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </section>
                    <section className='row mb-3 chartArea g-0'>
                        {/* 시술 별 총 인원*/}
                        <h6 className='w-100 text-center fw-bold'>시술 별 총 인원</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={list}
                                margin={{
                                    top: 5, right: 30, left: 0, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="category_name" 
                                    tickFormatter={(value) => value} 
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cnt">
                                    {list.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </section>
                    <section className='row flex-column m-0 mb-3 chartArea g-0'>
                        { /* 총 예상 금액 */}
                        <h6 className='w-100 text-center fw-bold'>총 예상 금액</h6>
                        <div className='row align-items-center flex-nowrap m-0 g-0 border'>
                            <div className='col-6 m-0 text-center fw-bold pt-1 pb-1'>시술명</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>총 금액</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>총 인원</div>
                        </div>
                        {
                            list.map((item, index) => (
                                <div key={index} className='row align-items-center flex-nowrap m-0 g-0 border'>
                                    <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 row'>
                                        <div className='mb-1'>{item.category_name}</div>
                                    </div>
                                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>
                                        <div className='mb-1'>{item.sum_prices}원</div>
                                    </div>
                                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.cnt}명</div>
                                </div>
                            ))
                        }
                    </section>
                </div>
            }

            {
                circleGraph && 
                <div className='row flex-column g-0'>
                    <section className='row mb-3 chartArea g-0'>
                        {/* 시술 별 총 금액*/}
                        <h6 className='w-100 text-center fw-bold'>시술 별 총 금액</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={list}
                                    dataKey="sum_prices"
                                    nameKey="category_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {list.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </section>
                    <section className='row mb-3 chartArea g-0 position-relative'>
                        {/* 시술 별 총 인원*/}
                        <h6 className='w-100 text-center fw-bold'>시술 별 총 인원</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={list}
                                    dataKey="cnt"
                                    nameKey="category_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {list.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </section>
                    <section className='row flex-column m-0 mb-3 chartArea g-0'>
                        { /* 총 예상 금액 */}
                        <h6 className='w-100 text-center fw-bold'>총 예상 금액</h6>
                        <div className='row align-items-center flex-nowrap m-0 g-0 border'>
                            <div className='col-6 m-0 text-center fw-bold pt-1 pb-1'>시술명</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>총 금액</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>총 인원</div>
                        </div>
                        {
                            list.map((item, index) => (
                                <div key={index} className='row align-items-center flex-nowrap m-0 g-0 border'>
                                    <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 row'>
                                        <div className='mb-1'>{item.category_name}</div>
                                    </div>
                                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>
                                        <div className='mb-1'>{item.sum_prices}원</div>
                                    </div>
                                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.cnt}명</div>
                                </div>
                            ))
                        }
                    </section>
                </div>
            }
            <section className='row flex-column m-0 mb-3 chartArea'>
                { /* 외상 금액 */}
                <h6 className='w-100 text-center fw-bold'>외상 금액</h6>
                <div className='row align-items-center flex-nowrap m-0 g-0 border'>
                    <div className='col-6 m-0 text-center fw-bold pt-1 pb-1'>시술명</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>완료</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>외상</div>
                </div>
                {
                    list.map((item, index) => (
                        <div key={index} className='row align-items-center flex-nowrap m-0 g-0 border'>
                            <div className='col-6 m-0 text-center fw-bold pt-1 pb-1 row'>
                                <div className='mb-1'>{item.category_name}</div>
                                <div>[{item.sum_prices}]</div>
                            </div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.sum_prices_ok}</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.sum_prices_fail}</div>
                        </div>
                    ))
                }
            </section>
            <section className='row flex-column m-0 mb-3 chartArea'>
                {/* 작업 완료 내역 */}
                <h6 className='w-100 text-center fw-bold'>작업 완료 내역</h6>
                <div className='row align-items-center flex-nowrap m-0 g-0 border'>
                    <div className='col-6 m-0 text-center fw-bold pt-1 pb-1'>시술명</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>완료</div>
                    <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>미완료</div>
                </div>
                {
                    list.map((item, index) => (
                        <div key={index} className='row align-items-center flex-nowrap m-0 g-0 border'>
                            <div className='col-6 m-0 text-center fw-bold pt-1 pb-1'>{item.category_name}</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.work_completed_ok}</div>
                            <div className='col-3 m-0 text-center fw-bold pt-1 pb-1'>{item.work_completed_fail}</div>
                        </div>
                    ))
                }
            </section>
        </div>
    );
}

export default TotalChart;
