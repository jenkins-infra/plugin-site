import {graphql, useStaticQuery} from 'gatsby';
import React from 'react';
import * as styles from './SearchByAlgolia.module.css';

const SearchByAlgolia = () => {
    const data = useStaticQuery(graphql`
        query {
          file(relativePath: { eq: "search-by-algolia-light-background.svg" }) {
              publicURL
          }
        }
    `);
    return (
        <a href="https://www.algolia.com/" className={styles.root}>
            <img
                src={data.file.publicURL}
                alt="Search provided by Algolia"
            />
        </a>
    );
};

export default SearchByAlgolia;

