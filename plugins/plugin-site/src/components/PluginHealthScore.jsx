import React from 'react';
import PropTypes from 'prop-types';

function PluginHealthScore(healthScore) {
    return (
        <div id="pluginHealthScore--container" className="container">
            <pre>{JSON.stringify(healthScore, null, 2)}</pre>
        </div>
    );
}

PluginHealthScore.propTypes = {
    healthScore: {
        value: PropTypes.number.isRequired,
        details: PropTypes.shape({}).isRequired
    }
};
export default PluginHealthScore;
