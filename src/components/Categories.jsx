import React from 'react';
import PropTypes from 'prop-types';
import {useStaticQuery, graphql} from 'gatsby';
import classNames from 'classnames';
import styles from '../styles/main.module.css';
import Category from './Category';

function Categories({clearCriteria, toggleCategory, activeCategories, activeLabels, toggleLabel}) {
    const data = useStaticQuery(graphql`
        query {
            categories: allJenkinsPluginCategory {
                edges {
                    node {
                        id
                        labels
                        title
                    }
                }
            }
        }
    `);
    const handleOnClick = (event) => {
        event.preventDefault();
        clearCriteria();
    };
    const anyCriteria = activeCategories.length > 0 || activeLabels.length > 0;
    
    return (
        <fieldset className={classNames(styles.Categories)}>
            <legend>
                Categories
                {anyCriteria && (
                    <button className="btn btn-secondary btn-sm show-all" name="showAll" onClick={handleOnClick}>
                        Show all
                    </button>
                )}
            </legend>
            <ul className={classNames(styles.Cols3, 'Cols3')}>
                {data.categories.edges.map(({node: category}) => (
                    <Category
                        key={category.id}
                        activeCategories={activeCategories}
                        activeLabels={activeLabels}
                        category={category}
                        toggleCategory={toggleCategory}
                        toggleLabel={toggleLabel}
                    />
                ))}
            </ul>
        </fieldset>
    );
}

Categories.propTypes = {
    activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearCriteria: PropTypes.func.isRequired,
    toggleCategory: PropTypes.func.isRequired,
    toggleLabel: PropTypes.func.isRequired
};

export default Categories;
