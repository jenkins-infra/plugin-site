import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Progress, Tooltip} from 'reactstrap';
 import '../styles/progressbar.css';

function PluginHealthScoreProgressBar({healthScore, name}) {
    const score = healthScore.value || 0;
    const color =
    score >= 80 ? "first" : score >=60 && score <80 ? 'second' : score >=40 && score <60 ? 'third'
     : score >=20 && score <40 ? 'fourth': 'fifth' ;

    const tooltipId = `tooltip-${name}`;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <>
            <div>
                <div>
                    Health Score
                    <a
                        href={`/${name}/healthscore/`}
                        id={tooltipId}
                        style={{marginLeft: '5px'}}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTooltipOpen(!tooltipOpen);
                        }}
                    >
                        ?
                    </a>
                    <Tooltip
                        placement="top"
                        isOpen={tooltipOpen}
                        autohide={false}
                        target={tooltipId}
                        toggle={toggle}
                        onClick={(e) => {e.stopPropagation();}}
                    >
                        View the details about plugin&apos;s
                        {' '}
                        <a
                            href={`/${name}/healthscore/`}
                        >
                            health score
                        </a>
                    </Tooltip>
                </div>
                <div>
                    {score}
                    %
                </div>
            </div>
            <Progress value={score} color={color} style={{height: '10px'}} striped/>
        </>
    );
}

PluginHealthScoreProgressBar.propTypes = {
    healthScore: PropTypes.shape({
        value: PropTypes.number,
    }),
    name: PropTypes.string,
};

export default PluginHealthScoreProgressBar;