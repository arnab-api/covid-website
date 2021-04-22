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
                location.pathname == '/'? 
                    <SearchBar 
                        dist_2_id={dist_2_id}
                        area = {area}
                        setArea = {setArea}
                        updateCharts = {updateCharts} updateCharts__For = {updateCharts__For}
                    />: null
            }
            <div className={styles.grow} />
            <ul className={styles.cats}>
                {/* <li className={styles.catItem}><Link to='/'>Home</Link></li> */}
                <li className={styles.catItem}><Link to='/rt'>R<sub>t</sub></Link></li>
                <li className={styles.catItem}><Link to='/dt'>D<sub>t</sub></Link></li>
                <li className={styles.catItem}><Link to='/maps'>Maps</Link></li>
                <li className={styles.catItem}><Link to='/world'>World</Link></li>
                <li className={styles.catItem}><Link to='/about'>MISC</Link></li>
            </ul>
        </div>
    )
};

export default TopBar;