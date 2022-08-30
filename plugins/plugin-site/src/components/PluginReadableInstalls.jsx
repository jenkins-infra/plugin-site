import React from 'react';
import PropTypes from 'prop-types';

function PluginReadableInstalls({currentInstalls}) {
    if (!currentInstalls && currentInstalls !== 0) {
        return <>No usage data available</>;
    }
    return <>{new Intl.NumberFormat('en-US').format(currentInstalls)}</>;
}

PluginReadableInstalls.propTypes = {
    currentInstalls: PropTypes.number
};

export default PluginReadableInstalls;
