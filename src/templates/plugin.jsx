import {graphql} from 'gatsby';
import React from 'react';
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
import PluginMaintainers from '../components/PluginMaintainers';
import PluginReadableInstalls from '../components/PluginReadableInstalls';

function shouldShowWikiUrl({url}) {
    return url && (url.startsWith('https://wiki.jenkins-ci.org') || url.startsWith('https://wiki.jenkins.io'));
}

function shouldShowGitHubUrl({url}) {
    return url && url.startsWith('https://github.com');
}

function PluginPage({data: {jenkinsPlugin: plugin}}) {
    return (
        <Layout id="pluginPage">
            <SEO title={cleanTitle(plugin.title)} description={plugin.excerpt} pathname={`/${plugin.id}`}/>
            <div className="row flex">
                <div className="col-md-9 main">
                    <div className="padded">
                        <h1 className="title">
                            {cleanTitle(plugin.title)}
                            <PluginActiveWarnings securityWarnings={plugin.securityWarnings} />
                            <span className="v">{plugin.version}</span>
                            <span className="sub">
                                {'Minimum Jenkins requirement: '}
                                {plugin.requiredCore}
                            </span>
                            <span className="sub">
                                {'ID: '}
                                {plugin.name}
                            </span>
                        </h1>
                        <div className="row flex">
                            <div className="col-md-4">
                                {plugin.stats && <div>
                                    {'Installs: '}
                                    <PluginReadableInstalls currentInstalls={plugin.stats.currentInstalls} />
                                </div>}
                                {plugin.scm && plugin.scm.link && <div><a href={plugin.scm.link}>GitHub →</a></div>}
                                {plugin.issueTracker && plugin.issueTracker.url && <div>
                                Issue tracker: &nbsp;
                                    <a href={plugin.issueTracker.url}>
                                        {plugin.issueTracker.name}
                                    </a>
                                </div>}
                                <PluginLastReleased plugin={plugin} />
                            </div>
                            <div className="col-md-4 maintainers">
                                <h5>Maintainers</h5>
                                <PluginMaintainers maintainers={plugin.maintainers} />
                            </div>
                            <div className="col-md-4 dependencies">
                                <h5>Dependencies</h5>
                                <PluginDependencies dependencies={plugin.dependencies} />
                            </div>
                        </div>
                        {plugin.wiki.content && <div className="content" dangerouslySetInnerHTML={{__html: plugin.wiki.content}} />}
                    </div>
                </div>
                <div className="col-md-3 gutter">
                    <a href={`https://updates.jenkins.io/download/plugins/${plugin.name}`}
                        className="btn btn-secondary">
                        <i className="icon-box" />
                        <span>Archives</span>
                        <span className="v">Get past versions</span>
                    </a>
                    <div className="chart">
                        <LineChart
                            total={plugin.stats.currentInstalls}
                            installations={plugin.stats.installations}
                        />
                    </div>
                
                    <h5>Links</h5>
                    {plugin.scm && plugin.scm.link && <div><a href={plugin.scm.link}>GitHub</a></div>}
                    <div><a href={`https://javadoc.jenkins.io/plugin/${plugin.name}`}>Javadoc</a></div>
                
                    <h5>Labels</h5>
                    <PluginLabels labels={plugin.labels} />
                    <br/>
                    {shouldShowWikiUrl(plugin.wiki) &&
                        <div className="update-link">
                            <h5>Help us to improve this page!</h5>
                            {'This content is served from the  '}
                            <a href={plugin.wiki.url} target="_wiki">Jenkins Wiki</a>
                            {' the '}
                            <a href="https://groups.google.com/forum/#!msg/jenkinsci-dev/lNmas8aBRrI/eL3u7A6qBwAJ" rel="noopener noreferrer" target="_blank">read-only state</a>
                            {'. We recommend moving the plugin documentation to GitHub, see the guidelines '}
                            <a href="https://jenkins.io/blog/2019/10/21/plugin-docs-on-github/" rel="noopener noreferrer" target="_blank">here</a>
                            {'.'}
                        </div>
                    }
                    {shouldShowGitHubUrl(plugin.wiki) &&
                        <div className="update-link">
                            <h5>Help us to improve this page!</h5>
                            {'To propose a change submit a pull request to  '}
                            <a href={plugin.wiki.url} rel="noopener noreferrer" target="_blank">the plugin page</a>
                            {' on GitHub. Read more about GitHub support on the plugin site in the '}
                            <a href="https://jenkins.io/doc/developer/publishing/documentation/" rel="noopener noreferrer" target="_blank">Jenkins developer documentation</a>
                            {'.'}  
                        </div>
                    }
    
                    <PluginInactiveWarnings securityWarnings={plugin.securityWarnings} />
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
        }).isRequired
    }).isRequired
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query PluginBySlug($name: String!) {
    jenkinsPlugin(name: {eq: $name}) {
      ...JenkinsPluginFragment
    }
  }
`;

export default PluginPage;
