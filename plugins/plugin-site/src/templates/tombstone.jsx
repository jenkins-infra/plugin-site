import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layout';
import SEO from '../components/SEO';

function TombstonePage({data: {suspendedPlugin: plugin}}) {
    const pluginPage = 'templates/plugin.jsx';
    return (
        <Layout id="pluginPage" reportProblemRelativeSourcePath={pluginPage} reportProblemUrl={`/${plugin.id}`} reportProblemTitle={plugin.id}>
            <SEO title={plugin.id} description={`Deprecated plugin: ${plugin.id}`} pathname={`/${plugin.id}`}/>

            <div className="container">
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
                    <ion-icon class="alert-icon" name="warning" />
                    {'Plugin distribution has been suspended, see '}
                    <a href={plugin.url}>{plugin.url.replace('https://issues.jenkins.io/browse/', '')}</a>
                    {' for details.'}
                </div>
            </div>
        </Layout>
    );
}

TombstonePage.propTypes = {
    data: PropTypes.shape({
        suspendedPlugin: PropTypes.shape({
            id: PropTypes.string,
            url: PropTypes.string
        }).isRequired
    }).isRequired
};

export const pageQuery = graphql`
  query SuspendedPluginBySlug($name: String!) {
    suspendedPlugin(id: {eq: $name}) {
      id
      url
    }
  }
`;


export default TombstonePage;
