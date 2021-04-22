import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
    return (
        <div className={styles.footerContainer}>
            <div>
                <p>Powered by: </p>
                <p>Copyright &copy; </p>
            </div>
        </div>
    )
}

export default Footer