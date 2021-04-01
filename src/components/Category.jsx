import React from 'react';
import PropTypes from 'prop-types';
import {useStaticQuery, graphql} from 'gatsby';
import classNames from 'classnames';
import * as styles from '../styles/main.module.css';
import Label from './Label';

function Category({activeCategories, category, toggleCategory, toggleLabel, activeLabels}) {
    const data = useStaticQuery(graphql`
        query {
            labels: allJenkinsPluginLabel {
                edges {
                    node {
                        id
                        title
                    }
                }
            }
        }
    `);
    const handleOnChange = () => toggleCategory(category);

    const matchedLabels = category.labels.map((id) => data.labels.edges.find(({node: label}) => label.id === id));
    const checked = activeCategories.find((active) => active === category.id) !== undefined;
    return (
        <li className={classNames(styles[category.id], category.id, {mask: checked})}>
            <label>
                <input type="checkbox" name="categories" value={category.id}
                    checked={checked} onChange={handleOnChange}/>
                <span>{category.title}</span>
            </label>
            <ul>
                {matchedLabels.map(({node: label}) => {
                    return(
                        <Label
                            key={label.id}
                            toggleLabel={toggleLabel}
                            activeLabels={activeLabels}
                            category={category}
                            label={label}
                        />
                    );
                })}
            </ul>
        </li>
    );
}

Category.propTypes = {
    activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        title: PropTypes.string.isRequired
    }).isRequired,
    toggleCategory: PropTypes.func.isRequired,
    toggleLabel: PropTypes.func.isRequired
};

export default Category;
