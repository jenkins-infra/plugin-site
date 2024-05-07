import React from 'react';
import PropTypes from 'prop-types';
import {formatPercentage} from '../commons/helper';

function PluginReadableInstalls({currentInstalls, percentage}) {
    if (!currentInstalls && currentInstalls !== 0) {
        return <h5>No usage data available</h5>;
    }
    return (<h5 title={`Total: ${new Intl.NumberFormat('en-US').format(currentInstalls)}`}>
        {`Installed on ${formatPercentage(percentage)} of\u{A0}controllers`}
    </h5>);
}

PluginReadableInstalls.propTypes = {
    currentInstalls: PropTypes.number,
    percentage: PropTypes.number
};

export default PluginReadableInstalls;
