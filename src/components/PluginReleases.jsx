import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago/tooltip';
import './PluginReleases.css';

function PluginIssues({pluginId}) {
    const [isLoading, setIsLoading] = useState(false);
    const [releases, setReleases] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await axios(`/api/plugin/${pluginId}/releases`);
            setReleases(result.data || []);
            setIsLoading(false);
        };
        fetchData();
        return;
    }, []);

    if (isLoading) {
        return (<div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>);
    }

    return (
        <div id="pluginReleases--container" className="container">
            {releases && releases.map(release => {
                return (
                    <div key={release.tag_name} className="card">
                        <div className="card-body">
                            <h5 className="card-title">{release.name || release.tag_name}</h5>
                            <div>
                                {'Released: '}
                                <ReactTimeAgo date={new Date(release.published_at)} />
                            </div>
                            <br />
                            <p className="card-text">
                                <ReactMarkdown source={release.body.replace('<!-- Optional: add a release summary here -->', '')} />
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

PluginIssues.propTypes = {
    pluginId: PropTypes.string.isRequired
};
export default PluginIssues;
