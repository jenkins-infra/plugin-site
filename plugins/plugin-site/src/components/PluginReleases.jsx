import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TimeAgo from 'react-timeago';

import InstallViaCLI from './InstallViaCLI';

import {formatter} from '../commons/helper';

import './PluginReleases.css';

function stripTag(tagName, pluginId) {
    // assume tags are in the form ${pluginId}${infix}${version} or ${prefix}${version}
    // where pluginId may contain digits, but prefix and infix cannot and version always starts with a digit
    return tagName.replace(pluginId, '').replace(/^[^0-9]*/, '');
}

function PluginReleases({pluginId, versions}) {
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios(`${process.env.GATSBY_API_URL || 'https://plugin-site-issues.jenkins.io/api'}/plugin/${pluginId}/releases`);
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
                const release = releases.find(release => version.version === stripTag(release.tagName, pluginId)) || {};
                return (
                    <div key={version.id} id={`version_${version.version}`} className="item card">
                        <div className="card-header">
                            <h5 className="card-title d-flex justify-content-between">
                                <div className="d-flex align-items-center">
                                    <a href={version.url}>{release.name && release.name != release.tagName ? release.name : version.version}</a>
                                    {release.bodyHTML && (<>
                                        <a href={release.htmlURL} title="See the release on GitHub" className="github-icon d-flex"><ion-icon name="logo-github" /></a>
                                    </>)}
                                    <a className="anchor after" href={`#version_${version.version}`}>
                                        <ion-icon name="link-outline"></ion-icon>
                                    </a>
                                </div>
                                <div>
                                    <TimeAgo date={new Date(version.releaseTimestamp)} formatter={formatter}/>
                                </div>
                            </h5>
                        </div>
                        <div className="card-body">
                            {release.bodyHTML && (<>
                                <div
                                    className="card-text"
                                    dangerouslySetInnerHTML={{__html: release.bodyHTML}}
                                />
                                <hr/>
                            </>)}
                            <div>
                                <h5>Installation options</h5>
                                <ul>
                                    <li><InstallViaCLI pluginId={pluginId} version={version.version} /></li>
                                    <li>
                                        {'Download: '}
                                        <a href={version.url}>{'direct link'}</a>
                                        {', '}
                                        <a href={`https://updates.jenkins.io/download/plugins/${pluginId}/#${version.version}`}>{'checksums'}</a>
                                    </li>
                                </ul>
                            </div>
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
        releaseTimestamp: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        requiredCore: PropTypes.string.isRequired,
        sha1: PropTypes.string.isRequired,
        sha256: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
    }))
};
export default PluginReleases;
