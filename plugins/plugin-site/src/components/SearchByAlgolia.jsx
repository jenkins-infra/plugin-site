import React from 'react';
import {root} from './SearchByAlgolia.module.css';
import Logo from '../images/search-by-algolia-light-background.svg';

const SearchByAlgolia = () => {
    return (
        <a href="https://www.algolia.com/" className={root}>
            <img
                src={Logo}
                alt="Search provided by Algolia"
            />
        </a>
    );
};

export default SearchByAlgolia;

