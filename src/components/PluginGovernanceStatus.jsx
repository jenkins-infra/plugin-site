import React from 'react';
import PropTypes from 'prop-types';

function PluginGovernanceStatus({plugin}) {
    if (!plugin || !plugin.labels) {
        return null;
    }
    return plugin.labels.map((id) => {
        if (id === 'adopt-this-plugin') {
            return (
                <div className="plugin-governance-notice">
                    <table>
                        <tr>
                            <td className="badge-box"><span className="badge active warning"/></td>
                            <td className="plugin-governance-notice-text">
                                <b>This plugin is up for adoption!</b>
                                {' We are looking for new maintainers. Visit our '}
                                <a href="https://jenkins.io/doc/developer/plugin-governance/adopt-a-plugin/">Adopt a Plugin</a>
                                {' initiative for more information.'}
                            </td>
                        </tr>
                    </table>
                </div>
            );
        } else if (id === 'deprecated') {
            return (
                <div className="plugin-governance-notice">
                    <table>
                        <tr>
                            <td className="badge-box"><span className="badge active warning"/></td>
                            <td className="plugin-governance-notice-text">
                                <b>Deprecated:</b>
                                {'This plugin has been marked as deprecated. '}
                                {'In general this means that the plugin is obsolete, no longer being developed, or may no longer work. '}
                                {'See the documentation for further information about the cause for the deprecation, and suggestions on how to proceed. '}
                                {'The deprecation process is also documented '}
                                <a href="https://jenkins.io/doc/developer/plugin-governance/deprecating-or-removing-plugin">here</a>
                                {'.'}

                            </td>
                        </tr>
                    </table>
                </div>
            );
        } else {
            return null;
        }
            
    });
}
  
PluginGovernanceStatus.propTypes = {
    plugin: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string).isRequired
    })
};

export default PluginGovernanceStatus;
