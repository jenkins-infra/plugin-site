import React from 'react';
import PropTypes from 'prop-types';

function ReportAProblem({reportProblemTitle, reportProblemUrl, reportProblemRelativeSourcePath}) {
    const title = `Report a problem with ${reportProblemRelativeSourcePath}`;
    const body = `Problem with the [${reportProblemTitle}](https://plugins.jenkins.io${reportProblemUrl}) page, [source file](https://github.com/jenkins-infra/plugin-site/tree/master/src/${reportProblemRelativeSourcePath})

    TODO: Describe the expected and actual behavior here

    %23%23 Screenshots
    TODO: Add screenshots if possible

    %23%23 Possible Solution

    %3C!-- If you have suggestions on a fix for the bug, please describe it here. --%3E

    N/A`.replace(/\n */g, '%0A');
    const pluginSiteReportUrl = `https://github.com/jenkins-infra/plugin-site/issues/new?labels=bug&template=4-bug.md&title=${reportProblemTitle} page - TODO: Put a summary here&body=${body}`;
    return !reportProblemTitle ? '' : (
        <p className="box">
            <a href={pluginSiteReportUrl} title={title}>
                <ion-icon class="report" name="warning" />
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
