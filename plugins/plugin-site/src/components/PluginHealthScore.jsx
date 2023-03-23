import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'antd';

function PluginHealthScore({healthScore, color}) {
    return (
        <>
            <h6>Health Score</h6>
            <Progress percent={healthScore} strokeColor={color} />
        </>
    );
}

PluginHealthScore.propTypes = {
    healthScore: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
};

export default PluginHealthScore;
