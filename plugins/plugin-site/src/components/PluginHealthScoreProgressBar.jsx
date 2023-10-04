import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Progress, Tooltip} from 'reactstrap';

function PluginHealthScoreProgressBar({healthScore, name}) {
    const score = healthScore.value || 0;
    const color =
    score > 80 ? 'success' : score > 60 ? 'warning' : 'danger';

    const tooltipId = `tooltip-${name}`;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <>
            <div>
                <div>
                    Health Score
                    <a
                        href={`https://plugin-health.jenkins.io/scores/${name}`}
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
                            href={`https://plugin-health.jenkins.io/scores/${name}`}
                        >
                            health score
                        </a>
                    </Tooltip>
                </div>
                <div>
                    {score}
                    /100
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
