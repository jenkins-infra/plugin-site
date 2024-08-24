import React from 'react';
import PropTypes from 'prop-types';

import {cleanTitle} from '../commons/helper';
import {PropTypesJenkinsPlugin} from '../proptypes';

import Layout from '../layout';
import SeoHeader from '../components/SeoHeader';
import InstallInstructions from '../components/InstallInstructions';
import LineChart from '../components/LineChart';
import PluginLabels from '../components/PluginLabels';
import PluginLastReleased from '../components/PluginLastReleased';
import PluginActiveWarnings from '../components/PluginActiveWarnings';
import PluginInactiveWarnings from '../components/PluginInactiveWarnings';
import PluginGovernanceStatus from '../components/PluginGovernanceStatus';
import PluginDevelopers from '../components/PluginDevelopers';
import PluginReadableInstalls from '../components/PluginReadableInstalls';
import PluginIssueTrackers from '../components/PluginIssueTrackers';
import PluginPageTabs from '../components/PluginPageTabs';

function shouldShowWikiUrl({url}) {
    return url?.startsWith('https://wiki.jenkins-ci.org/') ||
        url?.startsWith('https://wiki.jenkins.io/') ||
        url?.includes('github.com/jenkins-infra/plugins-wiki-docs') ||
        url?.includes('raw.githubusercontent.com/jenkins-infra/plugins-wiki-doc');
}

function shouldShowGitHubUrl({url}) {
    return url?.startsWith('https://github.com/') && !shouldShowWikiUrl({url});
}

function PluginPageLayout({plugin, children}) {
    const tabs = [
        {id: 'documentation', to: `/${plugin.name}/`, label: 'Documentation'},
        {id: 'releases', to: `/${plugin.name}/releases/`, label: 'Releases'},
        {id: 'issues', to: `/${plugin.name}/issues/`, label: 'Issues'},
        {id: 'dependencies', to: `/${plugin.name}/dependencies/`, label: 'Dependencies'},
        {id: 'health-score', to: `/${plugin.name}/healthscore/`, label: 'Health Score'},
    ];
    const wiki = plugin.wiki || {};
    const [isShowInstructions, setShowInstructions] = React.useState(false);
    const toggleShowInstructions = (e) => {
        e && e.preventDefault();
        setShowInstructions(!isShowInstructions);
    };
    return (
        <Layout id="pluginPage">
            <SeoHeader title={cleanTitle(plugin.title)} description={plugin.excerpt} pathname={`/${plugin.name}`}/>
            <div className="title-wrapper">
                <h1 className="title">
                    {cleanTitle(plugin.title)}
                </h1>
                <button className="app-button" onClick={toggleShowInstructions}>
                    How to install
                </button>
                <InstallInstructions isShowInstructions={isShowInstructions}
                    toggleShowInstructions={toggleShowInstructions}
                    pluginId={plugin.name}
                    pluginVersion={plugin.version}/>
            </div>
            <div className="row flex pluginContainer flex-column-reverse flex-md-row">
                <div className="col-md-9 main">
                    <PluginActiveWarnings securityWarnings={plugin.securityWarnings} />
                    <PluginGovernanceStatus plugin={plugin} />
                    <PluginPageTabs tabs={tabs} />
                    <div>
                        {children}
                    </div>
                </div>
                <div className="col-md-3 sidebar">
                    <h5>{`Version: ${plugin.version}`}</h5>
                    <PluginLastReleased buildDate={plugin.buildDate} releaseTimestamp={plugin.releaseTimestamp} />
                    <div>
                        {'Requires Jenkins '}
                        {plugin.requiredCore}
                    </div>
                    <div>
                        {'ID: '}
                        {plugin.name}
                    </div>
                    <div className="sidebarSection">
                        <PluginReadableInstalls currentInstalls={plugin.stats.currentInstalls}
                            percentage={plugin.stats.currentInstallPercentage} />
                        {(plugin.stats.installations || plugin.stats.installations === 0) && <>
                            <div className="chart">
                                <LineChart installations={plugin.stats.installations} />
                            </div>
                            <div className="label-link"><a href={`https://stats.jenkins.io/pluginversions/${plugin.name}.html`}>View detailed version information</a></div>
                        </>}
                    </div>
                    <div className="sidebarSection">
                        <h5>Links</h5>
                        {plugin.scm && <div className="label-link"><a href={plugin.scm}>GitHub</a></div>}
                        <PluginIssueTrackers issueTrackers={plugin.issueTrackers} />
                        {plugin.hasPipelineSteps && <div className="label-link"><a href={`https://www.jenkins.io/doc/pipeline/steps/${plugin.name}`}>Pipeline Step Reference</a></div>}
                        {plugin.hasExtensions && <div className="label-link"><a href={`https://www.jenkins.io/doc/developer/extensions/${plugin.name}`}>Extension Points</a></div>}
                        <div className="label-link"><a href={`https://javadoc.jenkins.io/plugin/${plugin.name}`}>Javadoc</a></div>
                    </div>
                    <div className="sidebarSection">
                        <h5>Labels</h5>
                        <PluginLabels labels={plugin.labels} />
                    </div>
                    <div className="sidebarSection">
                        <h5>Maintainers</h5>
                        <PluginDevelopers developers={plugin.developers} />
                    </div>
                    {shouldShowWikiUrl(wiki) &&
                        <div className="sidebarSection">
                            <h5>Help us improve this page!</h5>
                            {'This content is served from the  '}
                            <a href={wiki.url} target="_wiki">Jenkins Wiki Export</a>
                            {' which is now '}
                            <a href="https://www.jenkins.io/blog/2021/09/04/wiki-attacked/" rel="noopener noreferrer" target="_blank">permanently offline</a>
                            {' and before that a '}
                            <a href="https://groups.google.com/forum/#!msg/jenkinsci-dev/lNmas8aBRrI/eL3u7A6qBwAJ" rel="noopener noreferrer" target="_blank">read-only state</a>
                            {'. We would love your help in moving plugin documentation to GitHub, see '}
                            <a href="https://jenkins.io/blog/2019/10/21/plugin-docs-on-github/" rel="noopener noreferrer" target="_blank">the guidelines</a>
                            {'.'}
                        </div>
                    }
                    {shouldShowGitHubUrl(wiki) &&
                        <div className="sidebarSection">
                            <h5>Help us improve this page!</h5>
                            {'To propose a change submit a pull request to  '}
                            <a href={wiki.url} rel="noopener noreferrer" target="_blank">the plugin page</a>
                            {' on GitHub.'}
                        </div>
                    }
                    {plugin.securityWarnings &&
                        <div className="sidebarSection">
                            <PluginInactiveWarnings securityWarnings={plugin.securityWarnings} />
                        </div>
                    }
                </div>
            </div>
        </Layout>
    );
}

PluginPageLayout.displayName = 'PluginPageLayout';
PluginPageLayout.propTypes = {
    plugin: PropTypesJenkinsPlugin.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export default PluginPageLayout;

