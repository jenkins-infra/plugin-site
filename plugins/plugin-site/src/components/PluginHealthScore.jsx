import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'reactstrap';

function ScoreComponent({component: {name, description, value, max}}) {
    return (
        <div>
            <div>{name}</div>
            <div>{description}</div>
            <div>
                <Progress value={value} max={max}/>
            </div>
        </div>
    );
}

ScoreComponent.propTypes = {
    component: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired
};

function ScoreDetails({data: {name, components, value, weight, description}}) {
    return (
        <div>
            <h3>{name}</h3>
            <p>{description}</p>
            <p>
                This plugin scored a value of
                <strong>{` ${value} `}</strong>
                for this section.
            </p>
            <p>
                This section has a weight of
                <strong>{` ${weight} `}</strong>
                on the overall score of the plugin.
            </p>
            {components.map((component, idx) => {
                return (<ScoreComponent key={idx} component={component} />);
            })}
        </div>
    );
}

ScoreDetails.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        components: PropTypes.arrayOf(ScoreComponent.propTypes.component).isRequired,
        value: PropTypes.number.isRequired,
        weight: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
    }),
};

function PluginHealthScore({healthScore: {value: score, details}}) {
    return (
        <div id="pluginHealthScore--container" className="container">
            <div>{score}</div>
            <div>
                {details.sort((d1, d2) => d1.name - d2.name).map((data, idx) => {
                    return (
                        <ScoreDetails key={idx} data={data}/>
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
    }).isRequired,
};
export default PluginHealthScore;
