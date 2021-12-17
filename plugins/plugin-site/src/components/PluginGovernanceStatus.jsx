import React from 'react';
import PropTypes from 'prop-types';
import WarningsIcon from './WarningsIcon';

function PluginGovernanceStatus({plugin}) {
    if (!plugin || !plugin.labels) {
        return null;
    }
    return plugin.labels.map((id) => {
        if (id === 'adopt-this-plugin') {
            return (
                <div className="alert alert-warning alert-with-icon" key={id}>
                    <WarningsIcon />
                    <b>This plugin is up for adoption!</b>
                    {' We are looking for new maintainers. Visit our '}
                    <a href="https://jenkins.io/doc/developer/plugin-governance/adopt-a-plugin/">Adopt a Plugin</a>
                    {' initiative for more information.'}
                </div>
            );
        } else if (id === 'deprecated') {
            return (
                <div className="alert alert-warning alert-with-icon" key={id}>
                    <WarningsIcon />
                    <p>
                        <b>Deprecated:</b>
                        {'This plugin has been marked as '}
                        <a href="https://jenkins.io/doc/developer/plugin-governance/deprecating-or-removing-plugin">deprecated</a>
                        {'. In general, this means that this plugin is either obsolete, no longer being developed, or may no longer work.'}
                    </p>
                    {'More information about the cause of this deprecation, and suggestions on how to proceed may be found'}
                    {plugin.deprecationNotice && <>
                        {' at '}
                        <a href={plugin.deprecationNotice}>{plugin.deprecationNotice}</a>
                        {'.'}
                    </>}
                    {!plugin.deprecationNotice && ' in the documentation below.'}
                </div>
            );
        } else {
            return null;
        }
    });
}

PluginGovernanceStatus.propTypes = {
    plugin: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        deprecationNotice: PropTypes.string
    })
};

export default PluginGovernanceStatus;
