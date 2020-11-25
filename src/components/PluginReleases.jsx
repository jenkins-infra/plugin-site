import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TimeAgo from 'react-timeago';

import Checksum from './Checksum';
import InstallViaCLI from './InstallViaCLI';

import {formatter} from '../commons/helper';

import './PluginReleases.css';


function PluginReleases({pluginId, versions}) {
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios(`${process.env.DEV_OVERRIDE_API_PROXY || '/api'}/plugin/${pluginId}/releases`);
                let releases = [];
                if (result && result.data && result.data.releases) {
                    releases = result.data.releases;
                }
                setReleases(releases);
            } catch (e) {
                console.error('fetch api release data', e); // eslint-disable-line no-console
            }
        };
        fetchData();
        return;
    }, []);
    
    if (!versions) {
        return (<div id="pluginReleases--container" className="container" />);
    }
    
    return (
        <div id="pluginReleases--container" className="container">
            {versions.map(version => {
                const release = releases.find(release => version.version === release.tag_name.replace(/^[^0-9]*/, '')) || {};
                return (
                    <div key={version.id} className="item card">
                        <div className="card-header">
                            <h5 className="card-title d-flex justify-content-between">
                                <div><a href={version.url}>{release.name || version.version}</a></div>
                                <div>
                                    <TimeAgo date={new Date(version.buildDate)} formatter={formatter}/>
                                </div>
                            </h5>
                        </div>
                        <div className="card-body">
                            <div>
                                <Checksum type="SHA-1" value={version.sha1} />
                                <Checksum type="SHA-256" value={version.sha256} />
                                <InstallViaCLI pluginId={pluginId} version={version.version} />
                            </div>
                            <p
                                className="card-text"
                                dangerouslySetInnerHTML={{__html: release.bodyHTML}}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

PluginReleases.propTypes = {
    pluginId: PropTypes.string.isRequired,
    versions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        buildDate: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        requiredCore: PropTypes.string.isRequired,
        sha1: PropTypes.string.isRequired,
        sha256: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
    }))
};
export default PluginReleases;
