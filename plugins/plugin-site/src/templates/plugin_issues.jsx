import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypesJenkinsPlugin} from '../proptypes';

import PluginIssues from '../components/PluginIssues';
import PluginPageLayout from '../components/PluginPageLayout';

const TemplatePluginReleases = ({data: {jenkinsPlugin: plugin}}) => {
    return (
        <PluginPageLayout plugin={plugin}>
            {
                plugin?.issueTrackers?.length ?
                    <PluginIssues pluginId={plugin.name} /> :
                    <div className="alert alert-warning mt-3">This plugin does not specify any issue tracker.</div>
            }
        </PluginPageLayout>
    );
};

TemplatePluginReleases.displayName = 'PluginPage';
TemplatePluginReleases.propTypes = {
    data: PropTypes.shape({
        jenkinsPlugin: PropTypesJenkinsPlugin.isRequired,
    }).isRequired
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query ($name: String!) {
    jenkinsPlugin(name: {eq: $name}) {
      ...JenkinsPluginFragment
    }
  }
`;

export default TemplatePluginReleases;

