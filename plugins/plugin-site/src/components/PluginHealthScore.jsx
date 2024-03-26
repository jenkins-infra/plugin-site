import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';

import ucFirst from '../utils/ucfirst';
import {formatter} from '../commons/helper';
import './PluginHealthScore.css';

function ScoreIcon({score, className}) {
    const isCorrect = score === 100;
    return (
        <div className={`${className} pluginHealth-score-icon--${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ?
                <ion-icon name="checkmark-outline"/> :
                <ion-icon name="close-outline"/>
            }
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

function ScoreResolutions({resolutions}) {
    return (
        <div className="pluginHealth--score-component--resolutions">
            <ul>
                {resolutions.map((resolution, idx) => {
                    return (
                        <li key={idx}>
                            <a href={resolution.link}>{resolution.text}</a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

ScoreResolutions.propTypes = {
    resolutions: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string,
        link: PropTypes.string,
    })),
};

function ScoreComponent({component: {value, reasons, resolutions}}) {
    return (
        <div className="pluginHealth--score-component">
            <ScoreIcon className="pluginHealth--score-component--icon" score={value}/>
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
                <div className="pluginHealth--score-section--collapsible-icon">
                    {collapsed ?
                        <ion-icon name="chevron-down-outline"/> :
                        <ion-icon name="chevron-up-outline"/>
                    }
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

function PluginHealthScore({healthScore: {value: score, date, details}}) {
    return (
        <div className="container pluginHealth">
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

            <div>
                {'Computed: '}
                <TimeAgo date={Date.parse(date)} formatter={formatter}/>
            </div>
        </div>
    );
}

PluginHealthScore.propTypes = {
    healthScore: PropTypes.shape({
        value: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        details: PropTypes.arrayOf(ScoreDetail.propTypes.data).isRequired
    }).isRequired,
};
export default PluginHealthScore;
