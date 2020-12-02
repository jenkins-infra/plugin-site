import React from 'react';
import PropTypes from 'prop-types';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import * as styles from './InstallViaCLI.module.css';

function InstallViaCLI({pluginId, version}) {
    // isCopied is reset after 3 second timeout
    const [isCopied, handleCopy] = useCopyToClipboard(3000);
    const body = `jenkins-plugin-cli --plugins ${pluginId}:${version}`;

    return (
        <div className={styles.root}>
            <span>
                {'Install via '}
                <a href="https://github.com/jenkinsci/plugin-installation-manager-tool">cli</a>
                {': '}
            </span>
            <code className={styles.copy} title="click to copy" onClick={() => handleCopy(body)}>
                {body}
            </code>
            {isCopied && (<span>{' Copied '}</span>)}
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
