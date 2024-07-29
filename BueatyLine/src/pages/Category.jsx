// import { useEffect, useState } from 'react';
// import axios from 'axios';
import './Category.scss';
import CategoryList from '../components/CategoryList';

const Category = () => {
    return (
        <div className='Category'>
            <div className='subTitle'>Category List</div>
            <section>
                <CategoryList/>
            </section>


        </div>
    );
};

export default Category;
