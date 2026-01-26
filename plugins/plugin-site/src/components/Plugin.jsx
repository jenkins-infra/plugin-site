import PropTypes from 'prop-types';
import React from 'react';
import {cleanTitle, formatPercentage} from '../commons/helper';
import Icon from '../components/Icon';
import PluginLabels from '../components/PluginLabels';
import PluginLastReleased from '../components/PluginLastReleased';
import PluginDevelopers from '../components/PluginDevelopers';
import PluginHealthScoreProgressBar from './PluginHealthScoreProgressBar';


function Developers({developers}) {
    return (
        <>
            <PluginDevelopers developers={developers.length <= 3 ? developers : developers.slice(0, 2)} />
            {developers.length > 3 && (
                <div key="more_developers">
                    {`(${developers.length - 2} other contributors)`}
                </div>
            )}
        </>
    );
}

Developers.propTypes = PluginDevelopers.propTypes;

function Plugin({plugin: {name, title, stats, labels, excerpt, developers, buildDate, releaseTimestamp, healthScore}}) {
    const installStr = stats.currentInstallPercentage ? formatPercentage(stats.currentInstallPercentage) : '?';
    return (
        <a href={`/${name}/`} className="Plugin--PluginContainer">
            <div className="Plugin--IconContainer">
                <Icon title={title} />
            </div>
            <div className="Plugin--TitleContainer">
                <h4>{cleanTitle(title)}</h4>
            </div>
            <div className="Plugin--InstallsContainer">
                {`Used by ${installStr} of controllers`}
            </div>
            <div className="Plugin--VersionContainer">
                <span className="jc">
                    <PluginLastReleased buildDate={buildDate} releaseTimestamp={releaseTimestamp} />
                </span>
            </div>
            <div className="Plugin--LabelsContainer">
                <PluginLabels labels={labels} />
            </div>
            <div className="Plugin--ExcerptContainer" dangerouslySetInnerHTML={{__html: excerpt}} />
            <div className="Plugin--AuthorsContainer">
                <Developers developers={developers} />
            </div>
            <div className="Plugin--HealthScoreContainer">
                {healthScore && (<PluginHealthScoreProgressBar healthScore={healthScore} name={name}/>)}
            </div>
        </a>
    );
}

Plugin.propTypes = {
    plugin: PropTypes.shape({
        excerpt: PropTypes.string,
        buildDate: PropTypes.string,
        releaseTimestamp: PropTypes.string,
        labels: PropTypes.arrayOf(PropTypes.string),
        developers: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })),
        healthScore: PropTypes.shape({
            value: PropTypes.number,
        }),
        name: PropTypes.string.isRequired,
        requiredCore: PropTypes.string,
        sha1: PropTypes.string,
        stats: PropTypes.shape({
            currentInstallPercentage: PropTypes.number
        }).isRequired,
        title: PropTypes.string.isRequired,
        version: PropTypes.string,
    }).isRequired
};

export default Plugin;
