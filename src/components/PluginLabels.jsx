import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';

function PluginLabels({labels}) {
    if (!labels || labels.length === 0) {
        return (<div className="empty">This plugin has no labels</div>);
    }
    return labels.map((id) => {
        const label = labels.find((label) => label.id === id);
        const text = label !== undefined ? label.title : id;
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
