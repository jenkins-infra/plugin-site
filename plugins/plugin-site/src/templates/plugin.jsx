import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';

import {cleanTitle} from '../commons/helper';

import Layout from '../layout';
import SEO from '../components/SEO';
import InstallInstructions from '../components/InstallInstructions';
import LineChart from '../components/LineChart';
import PluginDependencies from '../components/PluginDependencies';
import PluginLabels from '../components/PluginLabels';
import PluginLastReleased from '../components/PluginLastReleased';
import PluginActiveWarnings from '../components/PluginActiveWarnings';
import PluginInactiveWarnings from '../components/PluginInactiveWarnings';
import PluginGovernanceStatus from '../components/PluginGovernanceStatus';
import PluginDevelopers from '../components/PluginDevelopers';
import PluginReadableInstalls from '../components/PluginReadableInstalls';
import PluginIssues from '../components/PluginIssues';
import PluginReleases from '../components/PluginReleases';
import PluginIssueTrackers from '../components/PluginIssueTrackers';

import {useSelectedPluginTab} from '../hooks/useSelectedTab';

function shouldShowWikiUrl(url) {
    return url?.startsWith('https://wiki.jenkins-ci.org/') ||
        url?.startsWith('https://wiki.jenkins.io/') ||
        url?.includes('github.com/jenkins-infra/plugins-wiki-docs') ||
        url?.includes('raw.githubusercontent.com/jenkins-infra/plugins-wiki-doc');
}

function shouldShowGitHubUrl(url) {
    return url?.startsWith('https://github.com/') && !shouldShowWikiUrl(url);
}

const PluginWikiContent = ({wiki}) => {
    if (wiki?.childHtmlRehype) {
        return <div className="content" dangerouslySetInnerHTML={{__html: wiki.childHtmlRehype.html}} />;
    }
    if (!wiki) {
        return (<div className="content">No documentation found for this plugin.</div>);
    }
    return (<div className="content">
        Documentation for this plugin is here:
        {' '}
        <a href={wiki.url}>{wiki.url}</a>
    </div>);
};
PluginWikiContent.displayName = 'PluginWikiContent';
PluginWikiContent.propTypes = {
    wiki: PropTypes.shape({
        childHtmlRehype: PropTypes.shape({
            html: PropTypes.string,
        }),
        url: PropTypes.string.isRequired
    }).isRequired,
};


const switchTab = (tab) => {
    const _paq = window._paq || [];
    _paq.push(['trackEvent', 'Plugin Page', 'Click Tab', tab]);
};

const Tabs = ({tabs, selectedTab}) => {
    // Tabs are client side only
    // only render them on the client
    // also forces gatsby to render based on hash
    if (!global.window) { return null; }
    return (
        <ul className="nav nav-pills">
            {tabs.map(tab => {
                const isSelected = selectedTab === tab.id;
                return (
                    <li className="nav-item" key={tab.id}>
                        <a className={`nav-link ${isSelected ? 'active' : ''}`} href={`#${tab.id}`} onClick={() => switchTab(tab.id)}>{tab.label}</a>
                    </li>
                );
            })}
        </ul>
    );
};
Tabs.displayName = 'Tabs';
Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    selectedTab: PropTypes.string.isRequired
};

function PluginPage({data: {jenkinsPlugin: plugin, reverseDependencies: reverseDependencies, versions}}) {
    const tabs = [
        {id: 'documentation', label: 'Documentation'},
        {id: 'releases', label: 'Releases'},
        {id: 'issues', label: 'Issues'},
        {id: 'dependencies', label: 'Dependencies'},
    ];

    const selectedTab = useSelectedPluginTab(tabs);

    const [isShowInstructions, setShowInstructions] = React.useState(false);
    const toggleShowInstructions = (e) => {
        e && e.preventDefault();
        setShowInstructions(!isShowInstructions);
    };
    return (
        <Layout id="pluginPage">
            <SEO title={cleanTitle(plugin.title)} description={plugin.excerpt} pathname={`/${plugin.name}`}/>
            <div className="title-wrapper">
                <h1 className="title">
                    {cleanTitle(plugin.title)}
                </h1>
                <button className="btn btn-secondary" onClick={toggleShowInstructions}>
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
                    <Tabs tabs={tabs} selectedTab={selectedTab.id} />
                    <div>
                        {(function () {
                            if (selectedTab.id === 'releases') {
                                return <PluginReleases pluginId={plugin.name} versions={versions.edges.map(edge => edge.node)} />;
                            }

                            if (selectedTab.id === 'issues') {
                                if (plugin?.issueTrackers?.length) {
                                    return <PluginIssues pluginId={plugin.name} />;
                                } else {
                                    return <div className="alert alert-warning mt-3">This plugin does not specify any issue tracker.</div>;
                                }
                            }
                            if (selectedTab.id === 'dependencies') {
                                return (
                                    <PluginDependencies dependencies={plugin.dependencies}
                                        reverseDependencies={reverseDependencies.edges.map(dep => dep.node)}
                                        hasBomEntry={plugin.hasBomEntry}
                                        gav={plugin.gav}/>
                                );
                            }
                            return <PluginWikiContent wiki={plugin.wiki} />;
                        })()}
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
                        {plugin.stats && <h5>
                            {'Installs: '}
                            <PluginReadableInstalls currentInstalls={plugin.stats.currentInstalls} />
                        </h5>}
                        <div className="chart">
                            <LineChart
                                installations={plugin.stats.installations}
                            />
                        </div>
                        <div className="label-link"><a href={`https://stats.jenkins.io/pluginversions/${plugin.name}.html`}>View detailed version information</a></div>
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
                    {shouldShowWikiUrl(plugin?.wiki?.url) &&
                        <div className="sidebarSection">
                            <h5>Help us improve this page!</h5>
                            {'This content is served from the  '}
                            <a href={plugin.wiki.url} target="_wiki">Jenkins Wiki Export</a>
                            {' which is now '}
                            <a href="https://www.jenkins.io/blog/2021/09/04/wiki-attacked/" rel="noopener noreferrer" target="_blank">permanently offline</a>
                            {'. We would love your help in moving plugin documentation to GitHub, see '}
                            <a href="https://jenkins.io/blog/2019/10/21/plugin-docs-on-github/" rel="noopener noreferrer" target="_blank">the guidelines</a>
                            {'.'}
                        </div>
                    }
                    {shouldShowGitHubUrl(plugin?.wiki?.url) &&
                        <div className="sidebarSection">
                            <h5>Help us improve this page!</h5>
                            {'To propose a change submit a pull request to  '}
                            <a href={plugin.wiki.url} rel="noopener noreferrer" target="_blank">the plugin page</a>
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

PluginPage.displayName = 'PluginPage';
PluginPage.propTypes = {
    data: PropTypes.shape({
        versions: PropTypes.shape({
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.shape({
                        id: PropTypes.string.isRequired,
                        name: PropTypes.string.isRequired,
                        releaseTimestamp: PropTypes.string.isRequired,
                        requiredCore: PropTypes.string.isRequired,
                        sha1: PropTypes.string.isRequired,
                        sha256: PropTypes.string.isRequired,
                        url: PropTypes.string.isRequired,
                        version: PropTypes.string.isRequired,
                    })
                })
            )
        }),
        jenkinsPlugin: PropTypes.shape({
            buildDate: PropTypes.string,
            releaseTimestamp: PropTypes.string,
            dependencies: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                title: PropTypes.string,
                optional: PropTypes.bool,
                implied: PropTypes.bool,
                version: PropTypes.string
            })),
            issueTrackers: PropTypes.arrayOf(PropTypes.shape({
                viewUrl: PropTypes.string,
                reportUrl: PropTypes.string,
            })),
            hasPipelineSteps: PropTypes.bool,
            hasExtensions: PropTypes.bool,
            excerpt: PropTypes.string,
            gav: PropTypes.string.isRequired,
            hasBomEntry: PropTypes.bool,
            labels: PropTypes.arrayOf(PropTypes.string),
            developers: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string
            })),
            name: PropTypes.string.isRequired,
            requiredCore: PropTypes.string,
            scm: PropTypes.string,
            securityWarnings: PropTypes.arrayOf(PropTypes.shape({
                active: PropTypes.bool,
                id: PropTypes.string,
                message: PropTypes.string,
                url: PropTypes.string,
                versions: PropTypes.arrayOf(PropTypes.shape({
                    firstVersion: PropTypes.string,
                    lastVersion: PropTypes.string,
                }))
            })),
            sha1: PropTypes.string,
            stats: PropTypes.shape({
                currentInstalls: PropTypes.number,
                installations: PropTypes.arrayOf(PropTypes.shape({
                    timestamp: PropTypes.number,
                    total: PropTypes.number
                }))
            }).isRequired,
            title: PropTypes.string.isRequired,
            wiki: PropTypes.shape({
                content: PropTypes.string,
                url: PropTypes.string
            }).isRequired,
            version: PropTypes.string
        }).isRequired,
        reverseDependencies: PropTypes.shape({
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.shape({
                        dependentName: PropTypes.string.isRequired,
                        dependentTitle: PropTypes.string.isRequired,
                        optional: PropTypes.bool,
                        implied: PropTypes.bool,
                    })
                })
            )
        })
    }).isRequired
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query PluginBySlug($name: String!) {
    jenkinsPlugin(name: {eq: $name}) {
      ...JenkinsPluginFragment
    }

    versions: allJenkinsPluginVersion(filter: {name: {eq: $name}}, sort: {fields: machineVersion, order: DESC}) {
      edges {
        node {
          releaseTimestamp
          compatibleSinceVersion
          dependencies {
            optional
            name
            version
          }
          id
          name
          requiredCore
          sha1
          sha256
          url
          version
        }
      }
    }

    reverseDependencies: allJenkinsPluginDependency(
      filter: {
        name: {eq: $name}
      }
      sort: {
        fields: [dependentTitle]
        order: ASC
      }) {
      edges {
        node {
          dependentTitle
          dependentName
          implied
          optional
        }
      }
    }
  }
`;

export default PluginPage;
