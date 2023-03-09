import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypesJenkinsPlugin} from '../proptypes';

import PluginPageLayout from '../components/PluginPageLayout';
import PluginReleases from '../components/PluginReleases';

const TemplatePluginReleases = ({data: {jenkinsPlugin: plugin, versions}}) => {
    return (
        <PluginPageLayout plugin={plugin}>
            <PluginReleases pluginId={plugin.name} versions={versions.edges.map(edge => edge.node)} />
        </PluginPageLayout>
    );
};

TemplatePluginReleases.displayName = 'PluginPage';
TemplatePluginReleases.propTypes = {
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
        jenkinsPlugin: PropTypesJenkinsPlugin.isRequired,
    }).isRequired
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query ($name: String!) {
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
  }
`;

export default TemplatePluginReleases;
