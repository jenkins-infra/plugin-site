import {graphql} from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypesJenkinsPlugin} from '../proptypes';

import PluginPageLayout from '../components/PluginPageLayout';
import PluginHealthScore from '../components/PluginHealthScore';

const TemplatePluginHealthScore = ({data: {jenkinsPlugin: plugin, healthScore}}) => {
    return (
        <PluginPageLayout plugin={plugin}>
            <PluginHealthScore healthScore={healthScore}/>
        </PluginPageLayout>
    );
};

TemplatePluginHealthScore.displayName = 'PluginPage';
TemplatePluginHealthScore.propTypes = {
    data: PropTypes.shape({
        jenkinsPlugin: PropTypesJenkinsPlugin.isRequired,
        healthScore: PropTypes.shape({
        }).isRequired
    })
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
    query ($name: String!) {
        jenkinsPlugin(name: {eq: $name}) {
            ...JenkinsPluginFragment
        }

        healthScore: allJenkinsPluginHealthScore(filter: {name: {eq: $name}}) {
            nodes {
                id
            }
        }
    }
`;

export default TemplatePluginHealthScore;
