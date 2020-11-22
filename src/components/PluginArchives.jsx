import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import TimeAgo from 'react-timeago';

import * as styles from './PluginArchives.module.css';

function base64ToHex(str) {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : `0${ hex}`);
    }
    return result.toUpperCase();
}


function Checksum({title, value}) {
    if (!value) {
        return null;
    }
    return (
        <div>
            <span>
                {title}
                :
            </span>
            {' '}
            <code>
                { base64ToHex(value) }
            </code>
        </div>
    );
}

Checksum.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string
};
  
function PluginArchives({pluginId, versions}) {
    return (
        <div>
            <h2>Archives</h2>
            <ul className={styles.root}>
                {versions.map(version => {
                    return (
                        <li key={version.id} className={styles.version}>
                            <Link to={version.url}>{version.version}</Link>
                            <div>
                                {'Released: '}
                                <TimeAgo date={version.buildDate} />
                            </div>
                            <div className={styles.checksums}>
                                <Checksum title="SHA-1" value={version.sha1} />
                                <Checksum title="SHA-256" value={version.sha256} />
                            </div>
                            <div>
                                {'Install via '}
                                <a href="https://github.com/jenkinsci/plugin-installation-manager-tool">cli</a>
                                <pre>
                                    <xmp>
                                        {`jenkins-plugin-cli --plugins ${pluginId}:${version.version}`}
                                    </xmp>
                                </pre>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

PluginArchives.propTypes = {
    pluginId: PropTypes.string.isRequired,
    versions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        buildDate: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        requiredCore: PropTypes.string.isRequired,
        sha1: PropTypes.string.isRequired,
        sha256: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
    }))
};

export default PluginArchives;
