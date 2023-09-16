import React from 'react';
import PropTypes from 'prop-types';
import {formatPercentage} from '../commons/helper';

function PluginReadableInstalls({currentInstalls, percentage}) {
    if (!currentInstalls && currentInstalls !== 0) {
        return <>No usage data available</>;
    }
    return (<span title={`Total: ${new Intl.NumberFormat('en-US').format(currentInstalls)}`}>
        {formatPercentage(percentage)}
    </span>);
}

PluginReadableInstalls.propTypes = {
    currentInstalls: PropTypes.number,
    percentage: PropTypes.number
};

export default PluginReadableInstalls;
