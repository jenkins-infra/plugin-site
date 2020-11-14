import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TimeAgo from 'react-timeago';
import './PluginReleases.css';
import {formatter} from '../commons/helper';


function PluginReleases({pluginId}) {
    const [isLoading, setIsLoading] = useState(false);
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await axios(`/api/plugin/${pluginId}/releases`);
            setReleases(result.data.releases || []);
            setIsLoading(false);
        };
        fetchData();
        return;
    }, []);

    if (isLoading) {
        return (<div className="spinner-wrapper">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>);
    }

    return (
        <div id="pluginReleases--container" className="container">
            {releases && releases.map(release => {
                return (
                    <div key={release.tag_name} className="item card">
                        <div className="card-header">
                            <h5 className="card-title d-flex justify-content-between">
                                <div>{release.name || release.tag_name}</div>
                                <div>
                                    {'Released: '}
                                    <TimeAgo date={new Date(release.published_at)} formatter={formatter}/>
                                </div>
                            </h5>
                        </div>
                        <div className="card-body">
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
    pluginId: PropTypes.string.isRequired
};
export default PluginReleases;
