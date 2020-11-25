import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './InstallViaCLI.module.css';

// TODO - https://www.npmjs.com/package/react-copy-to-clipboard
function InstallViaCLI({pluginId, version}) {
    return (
        <div className={styles.root}>
            <span>
                {'Install via '}
                <a href="https://github.com/jenkinsci/plugin-installation-manager-tool">cli</a>
                {': '}
            </span>
            <code>
                {`jenkins-plugin-cli --plugins ${pluginId}:${version}`}
            </code>
        </div>
    );
}

InstallViaCLI.defaultProps = {
    version: 'latest'
};

InstallViaCLI.propTypes = {
    pluginId: PropTypes.string.isRequired,
    version: PropTypes.string
};

export default InstallViaCLI;
