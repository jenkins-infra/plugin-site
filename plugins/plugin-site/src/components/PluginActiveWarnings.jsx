import React from 'react';
import PropTypes from 'prop-types';

function PluginActiveWarnings({securityWarnings}) {

    if (!securityWarnings) {
        return null;
    }
    const active = securityWarnings.filter(warning => warning.active);
    if (active.length == 0) {
        return null;
    }
    return (
        <div className="alert alert-danger alert-with-icon">
            <ion-icon class="alert-icon" name="warning" />
            {active.length == 1 ? singleWarning(active[0]) : multipleWarnings(active)}
        </div>
    );
}

function multipleWarnings(active) {
    return (
        <div>
            {'The Jenkins project announced security vulnerabilities affecting the current version of this plugin:'}
            <ul className="active-warning">
                { active.map(warning => {
                    return (
                        <li key={warning.url}>
                            <strong><a href={warning.url}>{warning.message}</a></strong>
                        </li>
                    );
                })}
            </ul>
            <div><a href="https://www.jenkins.io/security/plugins/#unresolved">{'Learn why we do this.'}</a></div>
        </div>
    );
}

function singleWarning(warning) {
    return (
        <div>
            {'The Jenkins project announced a security vulnerability affecting the current version of this plugin:'}
            <div className="active-warning">
                <a href={warning.url}>{warning.message}</a>
            </div>
            <div><a href="https://www.jenkins.io/security/plugins/#unresolved">{'Learn why we do this.'}</a></div>
        </div>
    );
}
  
PluginActiveWarnings.propTypes = {
    securityWarnings: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool.isRequired,
            url: PropTypes.string,
            message: PropTypes.string,
            versions: PropTypes.array,
        })
    )
};

export default PluginActiveWarnings;
