import React from 'react';
import PropTypes from 'prop-types';
import PluginReadableVersion from './PluginReadableVersion';

function PluginInactiveWarnings({securityWarnings}) {
    if (!securityWarnings) {
        return null;
    }
    const inactive = securityWarnings.filter(warning => !warning.active);
    if (inactive.length == 0) {
        return null;
    }
    return (
        <div>
            <h5>Previous Security Warnings</h5>
            <ul className="security-warning-list">
                {inactive.map(warning => {
                    return (
                        <li key={warning.url}>
                            <h6><a href={warning.url}>{warning.message}</a></h6>
                            <ul>
                                {warning.versions.map((version, idx) => (
                                    <li key={idx}>
                                        <PluginReadableVersion version={version} active={false} />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
  
PluginInactiveWarnings.propTypes = {
    securityWarnings: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool.isRequired,
            url: PropTypes.string,
            message: PropTypes.string,
            versions: PropTypes.array,
        })
    )
};

export default PluginInactiveWarnings;
