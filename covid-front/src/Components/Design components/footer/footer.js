import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
    return (
        <div className={styles.footerContainer}>
            {/* <ul className={styles.footerItems}> */}
                {/* <li>Powered by: </li> */}
                <li>Copyright &copy; </li>
            {/* </ul> */}
        </div>
    )
}

export default Footer