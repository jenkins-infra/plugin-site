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

TemplatePluginHealthScore.displayName = 'TemplatePluginHealthScore';
TemplatePluginHealthScore.propTypes = {
    data: PropTypes.shape({
        jenkinsPlugin: PropTypesJenkinsPlugin.isRequired,
        healthScore: PropTypes.shape({
            value: PropTypes.number.isRequired,
            details: PropTypes.arrayOf(PropTypes.shape({
                components: PropTypes.arrayOf(PropTypes.shape({
                    max: PropTypes.number.isRequired,
                    name: PropTypes.string.isRequired,
                    value: PropTypes.number.isRequired,
                })).isRequired,
                description: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                value: PropTypes.number.isRequired,
                weight: PropTypes.number.isRequired,
            }))
        }).isRequired
    })
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
    query ($name: String!) {
        jenkinsPlugin(name: {eq: $name}) {
            ...JenkinsPluginFragment
        }

        healthScore: jenkinsPluginHealthScore(id: {eq: $name}) {
            details {
                components {
                    max
                    name
                    value
                    description
                }
                description
                name
                value
                weight
            }
            value
        }
    }
`;

export default TemplatePluginHealthScore;
