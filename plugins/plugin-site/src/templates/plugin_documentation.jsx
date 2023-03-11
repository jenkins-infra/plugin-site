import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypesJenkinsPlugin} from '../proptypes';
import PluginPageLayout from '../components/PluginPageLayout';
import PluginWikiContent from '../components/PluginWikiContent';

const TemplatePluginDocumentation = ({data: {jenkinsPlugin: plugin}}) => {
    return (
        <PluginPageLayout plugin={plugin}>
            <PluginWikiContent wiki={plugin.wiki} />
        </PluginPageLayout>
    );
};

TemplatePluginDocumentation.displayName = 'PluginPage';
TemplatePluginDocumentation.propTypes = {
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

export default TemplatePluginDocumentation;

