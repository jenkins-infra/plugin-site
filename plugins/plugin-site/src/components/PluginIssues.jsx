import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TimeAgo from 'react-timeago';
import {formatter} from '../commons/helper';

function PluginIssues({pluginId}) {
    const [isLoading, setIsLoading] = useState(false);
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await axios(`${process.env.GATSBY_API_URL || 'https://plugin-site-issues.jenkins.io/api' }/plugin/${pluginId}/issues/open`);
            setIssues(result.data.issues || []);
            setIsLoading(false);
        };
        fetchData();
        return;
    }, []);

    if (isLoading) {
        return (<div className="spinner-wrapper">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>);
    }

    return (
        <div>
            {issues.length === 0 ? (
                <div>Currently, there are no open issues.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <caption>List of issues</caption>
                        <thead>
                            <tr>
                                <th scope="col">Key</th>
                                <th scope="col">Summary</th>
                                <th scope="col">Created</th>
                                <th scope="col">Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues && issues.map(issue => (
                                <tr key={issue.key}>
                                    <th scope="row"><a href={issue.url}>{issue.key}</a></th>
                                    <td>{issue.summary}</td>
                                    <td><TimeAgo date={new Date(issue.created)} formatter={formatter} /></td>
                                    <td><TimeAgo date={new Date(issue.updated)} formatter={formatter} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

PluginIssues.propTypes = {
    pluginId: PropTypes.string.isRequired
};
export default PluginIssues;
