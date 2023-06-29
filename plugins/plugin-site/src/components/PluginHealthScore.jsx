import React from 'react';
import PropTypes from 'prop-types';

function ScoreDetails({data: {name, components, value, weight, description}}) {
    return (
        <div className="container">
            <h3>{name}</h3>
            <pre>{JSON.stringify({components, value, weight, description}, null, 2)}</pre>
        </div>
    );
}
ScoreDetails.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        components: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            max: PropTypes.number.isRequired,
            description: PropTypes.string.isRequired,
        })),
        value: PropTypes.number.isRequired,
        weight: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
    })
};

function PluginHealthScore({healthScore: {value: score, details}}) {
    return (
        <div id="pluginHealthScore--container" className="container">
            <div>{score}</div>
            <div>
                {details.sort((d1, d2) => d1.name - d2.name).map((data, idx) => {
                    return (
                        <ScoreDetails key={idx} data={data} />
                    );
                })}
            </div>
        </div>
    );
}
PluginHealthScore.propTypes = {
    healthScore: PropTypes.shape({
        value: PropTypes.number.isRequired,
        details: PropTypes.arrayOf(
            ScoreDetails.propTypes.data
        ).isRequired
    }).isRequired
};
export default PluginHealthScore;
