import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layout';
import SEO from '../components/SEO';
import WarningsIcon from '../components/WarningsIcon';

function TombstonePage({data: {jenkinsPlugin: plugin}}) {
    const pluginPage = 'templates/plugin.jsx';
    return (
        <Layout id="pluginPage" reportProblemRelativeSourcePath={pluginPage} reportProblemUrl={`/${plugin.name}`} reportProblemTitle={plugin.id}>
            <SEO title={plugin.id} description={`Deprecated plugin: ${plugin.id}`} pathname={`/${plugin.id}`}/>

            <div className="row flex pluginContainer">
                <div className="col-md-9 main">
                    <div className="title-wrapper">
                        <h1 className="title">
                            {plugin.id}
                        </h1>
                        <div className="plugin-id">
                            {'ID: '}
                            {plugin.id}
                        </div>
                    </div>
                    <div className="alert alert-warning alert-with-icon">
                        <WarningsIcon/>
                        {'Plugin was removed from distribution, see '}
                        <a href={plugin.wiki.url}>{plugin.wiki.url}</a>
                        {' for details.'}
                    </div>
                </div>
                
            </div>
        </Layout>
    );
}

TombstonePage.propTypes = {
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
            }),
            title: PropTypes.string,
            wiki: PropTypes.shape({
                content: PropTypes.string,
                url: PropTypes.string
            }).isRequired,
            version: PropTypes.string
        }).isRequired
    }).isRequired
};

export const pageQuery = graphql`
  query SuspendedPluginBySlug($name: String!) {
    jenkinsPlugin(name: {eq: $name}) {
      ...JenkinsPluginFragment
    }
  }
`;


export default TombstonePage;
