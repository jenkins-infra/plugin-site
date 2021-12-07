import React from 'react';
import {graphql, Link} from 'gatsby';
import PropTypes from 'prop-types';
import {Router, Redirect} from '@reach/router';

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
import PluginDevelopers from '../components/PluginDevelopers';
import PluginReadableInstalls from '../components/PluginReadableInstalls';
import PluginIssues from '../components/PluginIssues';
import PluginReleases from '../components/PluginReleases';
import PluginIssueTrackers from '../components/PluginIssueTrackers';

const isActive = ({href, location}) => {
    // slightly more complicated to handle both /scp and /scp/
    const cannonicalHref = href.split('/').filter(Boolean).slice(0, 3).join('/');
    const cannonicalLocation = location.pathname.split('/').filter(Boolean).slice(0, 3).join('/');
    const isCurrent = cannonicalHref === cannonicalLocation;
    return isCurrent ? {className: 'nav-link active'} : {className: 'nav-link'};
};

function shouldShowWikiUrl({url}) {
    return url?.startsWith('https://wiki.jenkins-ci.org') || url?.startsWith('https://wiki.jenkins.io') || url?.includes('github.com/jenkins-infra/plugins-wiki-docs');
}

function shouldShowGitHubUrl({url}) {
    return url && url.startsWith('https://github.com');
}

const tabs = [
    {id: '', label: 'Documentation'},
    {id: 'releases', label: 'Releases'},
    {id: 'issues', label: 'Issues'},
    {id: 'dependencies', label: 'Dependencies'},
];

const PluginWikiContent = ({wiki}) => {
    if (wiki?.childMarkdownRemark) {
        return <div className="content" dangerouslySetInnerHTML={{__html: wiki.childMarkdownRemark.html}} />;
    }
    if (wiki?.childHtmlRehype) {
        return <div className="content" dangerouslySetInnerHTML={{__html: wiki.childHtmlRehype.html}} />;
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
        childMarkdownRemark: PropTypes.shape({
            html: PropTypes.string,
        }),
        childHtmlRehype: PropTypes.shape({
            html: PropTypes.string,
        }),
        url: PropTypes.string.isRequired
    }).isRequired,
};

function PluginPage({data: {jenkinsPlugin: plugin, reverseDependencies: reverseDependencies, versions}}) {
    const pluginPage = 'templates/plugin.jsx';
    const uri = `/${plugin.name.trim()}/`;

    return (
        <Layout id="pluginPage" reportProblemRelativeSourcePath={pluginPage} reportProblemTitle={plugin.title}
            reportProblemUrl={plugin?.issueTrackers?.find(tracker => tracker.reportUrl)?.reportUrl || `/${plugin.name}`}>
            <SEO title={cleanTitle(plugin.title)} description={plugin.excerpt} pathname={uri}/>
            <div className="title-wrapper">
                <h1 className="title">
                    {cleanTitle(plugin.title)}
                </h1>
                <div className="plugin-id">
                    {'ID: '}
                    {plugin.name}
                </div>
            </div>
            <div className="row flex pluginContainer flex-column-reverse flex-md-row">
                <div className="col-md-9 main">
                    <PluginActiveWarnings securityWarnings={plugin.securityWarnings} />
                    <PluginGovernanceStatus plugin={plugin} />
                    <ul className="nav nav-pills">
                        {tabs.map(tab => (
                            <li className="nav-item" key={tab.label}>
                                <Link
                                    getProps={isActive}
                                    to={tab.id ? `${uri}/${tab.id}` : `${uri}/`}>
                                    {tab.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <Router basepath={uri} primary={false}>
                            <PluginDependencies
                                path={'/dependencies'}
                                dependencies={plugin.dependencies}
                                reverseDependencies={reverseDependencies.edges.map(dep => dep.node)}
                                hasBomEntry={plugin.hasBomEntry}
                                gav={plugin.gav}
                            />
                            <PluginReleases
                                path={'/releases'}
                                pluginId={plugin.name}
                                versions={versions.edges.map(edge => edge.node)}
                            />
                            <PluginIssues
                                path={'/issues'}
                                pluginId={plugin.name}
                            />
                            <PluginWikiContent path="/" wiki={plugin.wiki} />
                            <Redirect from="*" to={`${uri}/`} noThrow default />
                        </Router>

                    </div>
                </div>
                <div className="col-md-3 sidebar">
                    <h5>{`Version: ${plugin.version}`}</h5>
                    <PluginLastReleased buildDate={plugin.buildDate} releaseTimestamp={plugin.releaseTimestamp} />
                    <div>
                        {'Requires Jenkins '}
                        {plugin.requiredCore}
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
                    {shouldShowWikiUrl(plugin.wiki) &&
                        <div className="sidebarSection">
                            <h5>Help us improve this page!</h5>
                            {'This content is served from the  '}
                            <a href={plugin.wiki.url} target="_wiki">Jenkins Wiki Export</a>
                            {' which is now '}
                            <a href="https://www.jenkins.io/blog/2021/09/04/wiki-attacked/" rel="noopener noreferrer" target="_blank">permanently offline</a>
                            {' and before that a '}
                            <a href="https://groups.google.com/forum/#!msg/jenkinsci-dev/lNmas8aBRrI/eL3u7A6qBwAJ" rel="noopener noreferrer" target="_blank">read-only state</a>
                            {'. We would love your help in moving plugin documentation to GitHub, see '}
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
                        buildDate: PropTypes.string.isRequired,
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
            hasPipelineSteps: PropTypes.boolean,
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

    versions: allJenkinsPluginVersion(filter: {name: {eq: $name}}, sort: {fields: buildDate, order: DESC}) {
      edges {
        node {
          buildDate
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
