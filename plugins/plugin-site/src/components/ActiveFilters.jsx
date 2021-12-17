import React from 'react';
import PropTypes from 'prop-types';
import ActiveCategory from './ActiveCategory';
import ActiveLabel from './ActiveLabel';
import {useStaticQuery, graphql} from 'gatsby';
import './ActiveFilters.css';

function ActiveFilters({activeCategories, activeLabels, activeQuery, clearQuery, toggleCategory, toggleLabel}) {
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

    const labels = data.labels.edges.reduce((prev, {node: label}) => {
        prev[label.id] = label;
        return prev;
    }, {});
    const categories = data.categories.edges.reduce((prev, {node: category}) => {
        prev[category.id] = category;
        return prev;
    }, {});

    const renderedActiveCategories = activeCategories.map((activeCategory) => {
        return (
            <ActiveCategory
                key={`category_${activeCategory}`}
                category={categories[activeCategories]}
                toggleCategory={toggleCategory}
            />
        );
    });
    const renderedActiveLabels = activeLabels.map((activeLabel) => {
        return (
            <ActiveLabel
                key={`label_${activeLabel}`}
                label={labels[activeLabel]}
                toggleLabel={toggleLabel}
            />
        );
    });
    return (
        <div className="ActiveFilters--FilterBox">
            <div>
                {renderedActiveCategories}
            </div>
            <div>
                {renderedActiveLabels}
            </div>
            <div>
                {activeQuery && <a
                    className="nav-link"
                    title="clear search string"
                    onClick={clearQuery}>
                    {activeQuery}
                </a>}
            </div>
        </div>
    );
}

ActiveFilters.propTypes = {
    activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeQuery: PropTypes.string.isRequired,
    clearQuery: PropTypes.func.isRequired,
    toggleCategory: PropTypes.func.isRequired,
    toggleLabel: PropTypes.func.isRequired
};

ActiveFilters.defaultProps = {
    activeCategories: [],
    activeLabels: [],
    activeQuery: '',
    clearQuery: () => {},
    toggleCategory: () => {},
    toggleLabel: () => {}
};
    
export default ActiveFilters;
