import {graphql} from 'gatsby';
import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {cleanTitle} from '../commons/helper';

import Layout from '../layout';
import SEO from '../components/SEO';
import LineChart from '../components/LineChart';
import PluginDependencies from '../components/PluginDependencies';
import PluginLabels from '../components/PluginLabels';
import PluginLastReleased from '../components/PluginLastReleased';
import PluginActiveWarnings from '../components/PluginActiveWarnings';
import PluginInactiveWarnings from '../components/PluginInactiveWarnings';
import PluginGovernanceStatus from '../components/PluginGovernanceStatus';
import PluginMaintainers from '../components/PluginMaintainers';
import PluginReadableInstalls from '../components/PluginReadableInstalls';
import PluginIssues from '../components/PluginIssues';
import PluginReleases from '../components/PluginReleases';

function shouldShowWikiUrl({url}) {
    return url && (url.startsWith('https://wiki.jenkins-ci.org') || url.startsWith('https://wiki.jenkins.io'));
}

function shouldShowGitHubUrl({url}) {
    return url && url.startsWith('https://github.com');
}

const tabs = [
    {id: 'documentation', label: 'Documentation'},
    {id: 'releases', label: 'Releases'},
    {id: 'issues', label: 'Issues'},
    {id: 'dependencies', label: 'Dependencies'},
];

function getDefaultTab() {
    const tabName = (typeof window !== 'undefined' && window.location.hash.replace('#', '')) || tabs[0].id;
    if (tabs.find(tab => tab.id === tabName)) {
        return tabName;
    }
    return tabs[0].id;
}

function PluginPage({data: {jenkinsPlugin: plugin, reverseDependencies: reverseDependencies}}) {
    const [state, setState] = useState({selectedTab: getDefaultTab()});
    const pluginPage = 'templates/plugin.jsx';

    return (
        <Layout id="pluginPage" reportProblemRelativeSourcePath={pluginPage} reportProblemUrl={`/${plugin.name}`} reportProblemTitle={plugin.title}>
            <SEO title={cleanTitle(plugin.title)} description={plugin.excerpt} pathname={`/${plugin.id}`}/>

            <div className="row flex pluginContainer">
                <div className="col-md-9 main">
                    <h1 className="title">
                        {cleanTitle(plugin.title)}
                    </h1>
                    <PluginActiveWarnings securityWarnings={plugin.securityWarnings} />
                    <PluginGovernanceStatus plugin={plugin} />
                    <ul className="nav nav-tabs">
                        {tabs.map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <a className={`nav-link ${state.selectedTab === tab.id ? 'active' : ''}`} href={`#${tab.id}`} onClick={() => setState({selectedTab: tab.id})}>{tab.label}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="padded">
                        {state.selectedTab === 'documentation' && (<>
                            <div className="title-details">
                                <span className="col-md-3">
                                    {'Version: '}
                                    {plugin.version}
                                </span>
                                <PluginLastReleased plugin={plugin} />
                                <span className="col-md-4">
                                    {'Requires Jenkins '}
                                    {plugin.requiredCore}
                                </span>
                                <span className="col-md-2">
                                    {'ID: '}
                                    {plugin.name}
                                </span>
                            </div>
                            {plugin.wiki.content && <div className="content" dangerouslySetInnerHTML={{__html: plugin.wiki.content}} />}
                        </>)}
                        {state.selectedTab === 'releases' && <PluginReleases pluginId={plugin.id} />}
                        {state.selectedTab === 'issues' && <PluginIssues pluginId={plugin.id} />}
                        {state.selectedTab === 'dependencies' && <PluginDependencies dependencies={plugin.dependencies} reverseDependencies={reverseDependencies.edges}/>}
                    </div>
                </div>
                <div className="col-md-3 gutter">
                    <a href={`https://updates.jenkins.io/download/plugins/${plugin.name}`}
                        className="btn btn-secondary">
                        <i className="icon-box" />
                        <span>Archives</span>
                        <span className="v">Get past versions</span>
                    </a>
                    {plugin.stats && <h5>
                        {'Installs: '}
                        <PluginReadableInstalls currentInstalls={plugin.stats.currentInstalls} />
                    </h5>}
                    <div className="chart">
                        <LineChart
                            installations={plugin.stats.installations}
                        />
                    </div>
                    <div className="sidebarSection">
                        <h5>Links</h5>
                        {plugin.scm && plugin.scm.link && <div className="label-link"><a href={plugin.scm.link}>GitHub</a></div>}
                        <div className="label-link"><a href={`https://javadoc.jenkins.io/plugin/${plugin.name}`}>Javadoc</a></div>
                    </div>
                    <div className="sidebarSection">
                        <h5>Labels</h5>
                        <PluginLabels labels={plugin.labels} />
                    </div>
                    <div className="sidebarSection">
                        <h5>Maintainers</h5>
                        <PluginMaintainers maintainers={plugin.maintainers} />
                    </div>
                    {shouldShowWikiUrl(plugin.wiki) &&
                        <div className="sidebarSection">
                            <h5>Help us improve this page!</h5>
                            {'This content is served from the  '}
                            <a href={plugin.wiki.url} target="_wiki">Jenkins Wiki</a>
                            {' the '}
                            <a href="https://groups.google.com/forum/#!msg/jenkinsci-dev/lNmas8aBRrI/eL3u7A6qBwAJ" rel="noopener noreferrer" target="_blank">read-only state</a>
                            {'. We recommend moving the plugin documentation to GitHub, see '}
                            <a href="https://jenkins.io/blog/2019/10/21/plugin-docs-on-github/" rel="noopener noreferrer" target="_blank">the guidelines</a>
                            {'.'}
                        </div>
                    }
                    {shouldShowGitHubUrl(plugin.wiki) &&
                        <div className="sidebarSection">
                            <h5>Help us improve this page!</h5>
                            {'To propose a change submit a pull request to  '}
                            <a href={plugin.wiki.url} rel="noopener noreferrer" target="_blank">the plugin page</a>
                            {' on GitHub.'}
                        </div>
                    }
                    <div className="sidebarSection">
                        <PluginInactiveWarnings securityWarnings={plugin.securityWarnings} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

PluginPage.propTypes = {
    data: PropTypes.shape({
        jenkinsPlugin: PropTypes.shape({
            dependencies: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                title: PropTypes.string,
                optional: PropTypes.bool,
                implied: PropTypes.bool,
                version: PropTypes.string
            })),
            excerpt: PropTypes.string,
            labels: PropTypes.arrayOf(PropTypes.string),
            maintainers: PropTypes.arrayOf(PropTypes.shape({
                email: PropTypes.string,
                id: PropTypes.string,
                name: PropTypes.string
            })),
            name: PropTypes.string.isRequired,
            requiredCore: PropTypes.string,
            scm: PropTypes.shape({
                inLatestRelease: PropTypes.string,
                issues: PropTypes.string,
                link: PropTypes.string,
                pullRequests: PropTypes.string,
                sinceLatestRelease: PropTypes.string
            }),
            securityWarnings: PropTypes.arrayOf(PropTypes.shape({
                active: PropTypes.boolean,
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
                currentInstalls: PropTypes.number.isRequired,
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
                        id: PropTypes.string.isRequired,
                        title: PropTypes.string.isRequired,
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

    reverseDependencies: allJenkinsPlugin(
      filter: {
        dependencies: {
          elemMatch: {
            name: {eq: $name}
          }
        }
      }
      sort: {
        fields: [title]
        order: ASC
      }) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

export default PluginPage;
