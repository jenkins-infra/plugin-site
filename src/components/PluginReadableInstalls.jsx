import React from 'react';
import PropTypes from 'prop-types';

function PluginReadableInstalls({currentInstalls}) {
    if (!currentInstalls) {
        return <>No usage data available</>;
    }
    return <>{currentInstalls}</>;
}

PluginReadableInstalls.propTypes = {
    currentInstalls: PropTypes.number.isRequired
};

export default PluginReadableInstalls;
