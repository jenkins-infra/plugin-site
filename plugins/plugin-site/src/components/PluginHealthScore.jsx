import React from 'react';
import PropTypes from 'prop-types';

import ucFirst from '../utils/ucfirst';
import './PluginHealthScore.css';

function ScoreValue({value}) {
    return (
        <div>
            {`${value}%`}
        </div>
    );
}

ScoreValue.propTypes = {
    value: PropTypes.number.isRequired,
};

function ScoreResolutions({resolutions}) {
    return (
        <div className="pluginHealth--score-component--resolutions">
            <ul>
                {resolutions.map((resolution, idx) => {
                    return (
                        <li key={idx}>
                            <a href={resolution}>{resolution}</a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

ScoreResolutions.propTypes = {
    resolutions: PropTypes.arrayOf(PropTypes.string),
};

function ScoreComponent({component: {value, reasons, resolutions}}) {
    return (
        <div className="pluginHealth--score-component">
            <div className="pluginHealth--score-component--reasons">
                {reasons.map((reason, idx) => {
                    return (
                        <span key={idx}>{reason}</span>
                    );
                })}
                {resolutions.length > 0 && <ScoreResolutions resolutions={resolutions} />}
            </div>
            <ScoreValue value={value} />
        </div>
    );
}

ScoreComponent.propTypes = {
    component: PropTypes.shape({
        value: PropTypes.number.isRequired,
        weight: PropTypes.number.isRequired,
        reasons: PropTypes.arrayOf(PropTypes.string),
        resolutions: ScoreResolutions.propTypes.resolutions,
    }).isRequired
};

function ScoreDetail({data: {name, components, value}}) {
    return (
        <div className="pluginHealth--score-section">
            <div className="pluginHealth--score-section--header">
                <div className="pluginHealth--score-section--header-title">
                    {name.split('-').map(ucFirst).join(' ')}
                </div>
                <ScoreValue value={value} />
            </div>
            <div>
                {components.sort((d1, d2) => d2.weight - d2.weight).map((component, idx) => {
                    return (<ScoreComponent key={idx} component={component} />);
                })}
            </div>
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
                <div>
                    <div className="pluginHealth--score-title">
                        <span id="pluginHealth--score-value">{score}</span>
                        <span id="pluginHealth--score-unit">%</span>
                    </div>
                    <span id="pluginHealth--score-label">health score</span>
                </div>
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
