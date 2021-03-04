import React from 'react';
import * as styles from './SearchByAlgolia.module.css';
import Logo from '../images/search-by-algolia-light-background.svg';

const SearchByAlgolia = () => {
    return (
        <a href="https://www.algolia.com/" className={styles.root}>
            <img
                src={Logo}
                alt="Search provided by Algolia"
            />
        </a>
    );
};

export default SearchByAlgolia;

