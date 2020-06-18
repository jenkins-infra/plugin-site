import React from 'react';
import PropTypes from 'prop-types';

function ReportAProblem({reportProblemTitle, reportProblemUrl, reportProblemRelativeSourcePath}) {
    const title = `Report a problem with ${reportProblemRelativeSourcePath}`;
    
    return (
        <p className="box">
            <a href={`https://github.com/jenkins-infra/plugin-site/issues/new?labels=bug&template=4-bug.md&title=${reportProblemTitle} page - TODO: Put a summary here&body=Problem with the [${reportProblemTitle}](https://plugins.jenkins.io${reportProblemUrl}) page, [source file](https://github.com/jenkins-infra/plugin-site/tree/master/src/${reportProblemRelativeSourcePath})%0A%0ATODO: Describe the expected and actual behavior here %0A%0A%23%23 Screenshots %0A%0A TODO: Add screenshots if possible %0A%0A%23%23 Possible Solution %0A%0A%3C!-- If you have suggestions on a fix for the bug, please describe it here. --%3E %0A%0AN/A`} title={title}>
                Report a problem
            </a>
        </p>
    );
}

ReportAProblem.propTypes = {
    reportProblemTitle: PropTypes.string.isRequired,
    reportProblemUrl: PropTypes.string.isRequired,
    reportProblemRelativeSourcePath: PropTypes.string.isRequired
};

export default ReportAProblem;
