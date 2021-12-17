import React from 'react';
import PropTypes from 'prop-types';
import ucFirst from '../utils/ucfirst';


function jqlReplaceFunc(_matches, component) {
    const jql = `resolution is EMPTY and component=${component}`;
    return `jql=${encodeURIComponent(jql)}`;
}

function PluginIssueTrackers({issueTrackers}) {
    if (!issueTrackers || !issueTrackers.length) {
        return null;
    }
    return issueTrackers.map(tracker => {
        return (
            <React.Fragment key={tracker.reportUrl}>
                <div className="label-link">
                    <a href={tracker.viewUrl.replace(/jql=component=(\w+)/, jqlReplaceFunc)}>
                        {`Open issues (${ucFirst(tracker.type)})`}
                    </a>
                </div>
                <div className="label-link">
                    <a href={tracker.reportUrl}>
                        {`Report an issue (${ucFirst(tracker.type)})`}
                    </a>
                </div>
            </React.Fragment>
        );
    });
}

PluginIssueTrackers.propTypes = {
    issueTrackers: PropTypes.arrayOf(PropTypes.shape({
        reportUrl: PropTypes.string,
        viewUrl: PropTypes.string,
        type: PropTypes.string,
    })),
};
PluginIssueTrackers.displayName = 'PluginIssueTrackers';

export default PluginIssueTrackers;

