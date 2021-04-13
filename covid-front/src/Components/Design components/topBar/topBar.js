import React from 'react';
import { Link, useLocation} from 'react-router-dom';

import SearchBar from '../searchBar/searchBar';

import styles from './topBar.module.css';

const TopBar = ({
        dist_2_id, 
        area, setArea,
        updateCharts, updateCharts__For
    }) => {

    const location = useLocation();

    // console.log("from topbar", dist_2_id)

    return (
        <div className={styles.topBar}>
            <Link to='/'><div className={styles.brand}>Covid 19 in Bangladesh</div></Link>
            <div className={styles.grow} />
            {
                location.pathname !== '/about'? 
                    <SearchBar 
                        dist_2_id={dist_2_id}
                        area = {area}
                        setArea = {setArea}
                        updateCharts = {updateCharts} updateCharts__For = {updateCharts__For}
                    />: null
            }
            <div className={styles.grow} />
            <ul className={styles.cats}>
                <li className={styles.catItem}><Link to='/home'>Home</Link></li>
                <li className={styles.catItem}><Link to='/about'>About Us</Link></li>
            </ul>
        </div>
    )
};

export default TopBar;