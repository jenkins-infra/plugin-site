import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypesJenkinsPlugin} from '../proptypes';

import PluginPageLayout from '../components/PluginPageLayout';
import PluginHealthScore from '../components/PluginHealthScore';

const TemplatePluginHealthScore = ({data: {jenkinsPlugin: plugin}}) => {
    return (
        <PluginPageLayout plugin={plugin}>
            <PluginHealthScore />
        </PluginPageLayout>
    );
};

TemplatePluginHealthScore.displayName = 'PluginPage';
TemplatePluginHealthScore.propTypes = {
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

        health: allJenkinsPluginVersion(filter: {name: {eq: $name}}) {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`;

export default TemplatePluginHealthScore;
