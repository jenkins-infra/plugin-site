import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypesJenkinsPlugin} from '../proptypes';
import PluginPageLayout from '../components/PluginPageLayout';
import PluginDependencies from '../components/PluginDependencies';

const TemplatePluginDependencies = ({data: {jenkinsPlugin: plugin, reverseDependencies}}) => {
    return (
        <PluginPageLayout plugin={plugin}>
            <PluginDependencies dependencies={plugin.dependencies}
                reverseDependencies={reverseDependencies.edges.map(dep => dep.node)}
                hasBomEntry={plugin.hasBomEntry}
                gav={plugin.gav}/>
        </PluginPageLayout>
    );
};

TemplatePluginDependencies.displayName = 'PluginPage';
TemplatePluginDependencies.propTypes = {
    data: PropTypes.shape({
        jenkinsPlugin: PropTypesJenkinsPlugin.isRequired,
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
  query ($name: String!) {
    jenkinsPlugin(name: {eq: $name}) {
      ...JenkinsPluginFragment
    }

    reverseDependencies: allJenkinsPluginDependency(
      filter: {
        name: {eq: $name}
      }
      sort: {
        dependentTitle: ASC
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

export default TemplatePluginDependencies;
