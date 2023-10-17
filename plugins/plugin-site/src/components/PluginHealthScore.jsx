import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'reactstrap';

import './PluginHealthScore.css';

function ScoreComponent({component: {name, value}}) {
    return (
        <div>
            <div>{name}</div>
            <div>
                <Progress value={value}/>
            </div>
        </div>
    );
}

ScoreComponent.propTypes = {
    component: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        weight: PropTypes.number.isRequired,
        reasons: PropTypes.arrayOf(PropTypes.string),
    }).isRequired
};

function ScoreDetail({data: {name, components, value, weight}}) {
    return (
        <div>
            <h3>{name}</h3>
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

ScoreDetail.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        components: PropTypes.arrayOf(ScoreComponent.propTypes.component).isRequired,
        value: PropTypes.number.isRequired,
        weight: PropTypes.number.isRequired,
    }),
};

function compareString(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function PluginHealthScore({healthScore: {value: score, details}}) {
    return (
        <div className="container">
            <div id="pluginHealth--score">
                <span id="pluginHealth--scoreTitle">Plugin Health Score</span>
                <span id="pluginHealth--scoreValue">{`${score}%`}</span>
                <span id="pluginHealth--scoreProgress">
                    <Progress value={score} />
                </span>
            </div>
            <div>
                {details.sort((d1, d2) => compareString(d1.name, d2.name)).map((data, idx) => {
                    return (
                        <ScoreDetail key={idx} data={data}/>
                    );
                })}
            </div>
        </div>
    );
}

PluginHealthScore.propTypes = {
    healthScore: PropTypes.shape({
        value: PropTypes.number.isRequired,
        details: PropTypes.arrayOf(ScoreDetail.propTypes.data).isRequired
    }).isRequired,
};
export default PluginHealthScore;
