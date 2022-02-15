import React from 'react';
import PropTypes from 'prop-types';
import {root} from './InstallViaCLI.module.css';
import ClipboardButton from './ClipboardButton';

function InstallViaCLI({pluginId, version}) {
    // isCopied is reset after 3 second timeout
    const body = `jenkins-plugin-cli --plugins ${pluginId}:${version}`;

    return (
        <div className={root}>
            <span>
                {'Using '}
                <a href="https://github.com/jenkinsci/plugin-installation-manager-tool">the CLI tool</a>
                {': '}
            </span>
            <code>
                {body}
            </code>
            <ClipboardButton content={body}/>
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
