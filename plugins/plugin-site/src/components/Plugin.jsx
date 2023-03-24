import PropTypes from 'prop-types';
import React from 'react';
import {navigate, useStaticQuery, graphql} from 'gatsby';
import {cleanTitle} from '../commons/helper';
import Icon from '../components/Icon';
import PluginLabels from '../components/PluginLabels';
import PluginLastReleased from '../components/PluginLastReleased';
import PluginDevelopers from '../components/PluginDevelopers';
import PluginHealthScore from '../components/PluginHealthScore';


function Developers({developers}) {
    return (
        <>
            <PluginDevelopers developers={developers.slice(0, 2)} />
            {developers.length > 2 && (
                <div key="more_developers">
                    {`(${developers.length - 2} other contributors)`}
                </div>
            )}
        </>
    );
}

Developers.propTypes = PluginDevelopers.propTypes;

function Plugin({plugin: {name, title, stats, labels, excerpt, developers, buildDate, releaseTimestamp}}) {
    let progress = 0;
    let color =
    progress > 80 ? 'success' : progress > 60 ? 'warning' : 'danger';

    const graphqlData = useStaticQuery(graphql`
        query {
            allJenkinsPluginHealthScore {
                edges {
                    node {
                        id
                        value
                    }
                }
            }
        }
    `);

    const health = graphqlData.allJenkinsPluginHealthScore.edges.find(
        (edge) => edge.node.id === name
    );

    if (health) {
        progress = health.node.value;
        color =
        progress > 80 ? 'success' : progress > 60 ? 'warning' : 'danger';
    }

    return (
        <div onClick={() => navigate(`/${name}/`)} className="Plugin--PluginContainer">
            <div className="Plugin--IconContainer">
                <Icon title={title} />
            </div>
            <div className="Plugin--TitleContainer">
                <h4>{cleanTitle(title)}</h4>
            </div>
            <div className="Plugin--InstallsContainer">
                {'Installs:  '}
                {stats.currentInstalls}
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
                <PluginHealthScore healthScore={progress} color={color} />
            </div>
        </div>
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
        name: PropTypes.string.isRequired,
        requiredCore: PropTypes.string,
        sha1: PropTypes.string,
        stats: PropTypes.shape({
            currentInstalls: PropTypes.number
        }).isRequired,
        title: PropTypes.string.isRequired,
        version: PropTypes.string,
    }).isRequired
};

export default Plugin;
