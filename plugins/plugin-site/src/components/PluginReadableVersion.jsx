import React from 'react';
import PropTypes from 'prop-types';

function PluginReadableVersion({version, active}) {
    if (version.firstVersion && version.lastVersion) {
        return <>{`Affects version ${version.firstVersion} to ${version.lastVersion}`}</>;
    } else if (version.firstVersion && active) {
        return <>{`Affects version ${version.lastVersion} and later`}</>;
    } else if (version.lastVersion) {
        return <>{`Affects version ${version.lastVersion} and earlier`}</>;
    } else {
        return <>{active ? 'Affects all versions' : 'Affects some versions'}</>;
    }
}

PluginReadableVersion.propTypes = {
    active: PropTypes.bool.isRequired,
    version: PropTypes.shape({
        firstVersion: PropTypes.string,
        lastVersion: PropTypes.string,
    })
};

export default PluginReadableVersion;
