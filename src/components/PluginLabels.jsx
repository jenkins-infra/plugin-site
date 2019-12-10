import React from 'react';
import PropTypes from 'prop-types';
import {Link, useStaticQuery, graphql} from 'gatsby';

function PluginLabels({labels}) {
    const allLabels = useStaticQuery(graphql`
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
    `).labels.edges.reduce((prev, {node: label}) => {
        prev[label.id] = label.title;
        return prev;
    }, {});

    if (!labels || labels.length === 0) {
        return (<div className="empty">This plugin has no labels</div>);
    }
    return labels.map((id) => {
        const text = (allLabels[id] || id).replace(' development', '');
        // FIXME - search page
        return (
            <div className="label-link" key={id}>
                <Link to={`/?labels=${id}`}>{text}</Link>
            </div>
        );
    });
}

PluginLabels.propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default PluginLabels;
