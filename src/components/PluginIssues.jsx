import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function PluginIssues({pluginId}) {
    const [isLoading, setIsLoading] = useState(false);
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await axios(`/api/plugin/${pluginId}/issues/open`);
            setIssues(result.data.issues || []);
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
        <div>
            <div className="table-responsive">
                <table className="table">
                    <caption>List of issues</caption>
                    <thead>
                        <tr>
                            <th scope="col">Key</th>
                            <th scope="col">Summary</th>
                            <th scope="col">Assignee</th>
                            <th scope="col">Reporter</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Status</th>
                            <th scope="col">Resolution</th>
                            <th scope="col">Created</th>
                            <th scope="col">Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues && issues.map(issue => {
                            return (
                                <tr key={issue.key}>
                                    <th scope="row"><a href={issue.url}>{issue.key}</a></th>
                                    <td>{issue.summary}</td>
                                    <td>{issue.assignee}</td>
                                    <td>{issue.reporter}</td>
                                    <td>{issue.priority}</td>
                                    <td>{issue.status}</td>
                                    <td>{issue.resolution}</td>
                                    <td>{issue.created}</td>
                                    <td>{issue.updated}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

PluginIssues.propTypes = {
    pluginId: PropTypes.string.isRequired
};
export default PluginIssues;
