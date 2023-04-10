import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'reactstrap';

function PluginHealthScore({healthScore}) {
    const score = healthScore.value || 0;
    const color =
    score > 80 ? 'success' : score > 60 ? 'warning' : 'danger';
    return (
        <>
            <div>
                Health Score
                <div>
                    {score}
                    /100
                </div>
            </div>
            <Progress value={score} color={color} style={{height: '10px'}} striped/>
        </>
    );
}

PluginHealthScore.propTypes = {
    healthScore: PropTypes.shape({
        value: PropTypes.number,
    }),
};

export default PluginHealthScore;
