import React, {useState} from 'react';
import PropTypes from 'prop-types';

import checkmark from '../images/checkmark-outline.svg';
import close from '../images/close-outline.svg';
import chevronUp from '../images/chevron-up-outline.svg';
import chevronDown from '../images/chevron-down-outline.svg';

import ucFirst from '../utils/ucfirst';
import './PluginHealthScore.css';

function ScoreIcon({score, className}) {
    const isCorrect = score === 100;
    return (
        <div className={`${className} pluginHealth-score-icon--${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? <img src={checkmark} /> : <img src={close} />}
        </div>
    );
}

ScoreIcon.propTypes = {
    className: PropTypes.string,
    score: PropTypes.number.isRequired,
};

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

function ScoreComponent({component: {value, reasons}}) {
    return (
        <div className="pluginHealth--score-component">
            <ScoreIcon className="pluginHealth--score-component--icon" score={value}/>
            <div className="pluginHealth--score-component--reasons">
                {reasons.map((reason, idx) => {
                    return (
                        <span key={idx}>{reason}</span>
                    );
                })}
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
    }).isRequired
};

function ScoreDetail({data: {name, components, value}}) {
    const [collapsed, setCollapsed] = useState(value === 100);
    return (
        <div className="pluginHealth--score-section">
            <div className="pluginHealth--score-section--header" onClick={() => setCollapsed(!collapsed)}>
                <div className="pluginHealth--score-section--header-icon">
                    <ScoreIcon className="pluginHealth--score-section--header--icon" score={value}/>
                </div>
                <div className="pluginHealth--score-section--header-title">
                    {name.split('-').map(ucFirst).join(' ')}
                </div>
                <ScoreValue value={value}/>
                <div className="pluginHealth--score-section--collapsable-icon">
                    {collapsed ? <img src={chevronDown}/> : <img src={chevronUp}/>}
                </div>
            </div>
            <div className={`pluginHealth-score-components--list ${collapsed ? 'collapse' : ''}`}>
                {components.sort((d1, d2) => d2.weight - d2.weight).map((component, idx) => {
                    return (<ScoreComponent key={idx} component={component}/>);
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
