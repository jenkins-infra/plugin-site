import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'reactstrap';

function PluginHealthScore({healthScore, color}) {
    return (
        <>
            <div>
                Health Score
                <spam>
                    {healthScore}
                    /100
                </spam>
            </div>
            <Progress value={healthScore} color={color} style={{height: '10px'}} striped/>
        </>
    );
}

PluginHealthScore.propTypes = {
    healthScore: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
};

export default PluginHealthScore;
