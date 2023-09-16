import PropTypes from 'prop-types';

export const PropTypesJenkinsPlugin = PropTypes.shape({
    buildDate: PropTypes.string,
    releaseTimestamp: PropTypes.string,
    dependencies: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        optional: PropTypes.bool,
        implied: PropTypes.bool,
        version: PropTypes.string
    })),
    issueTrackers: PropTypes.arrayOf(PropTypes.shape({
        viewUrl: PropTypes.string,
        reportUrl: PropTypes.string,
    })),
    hasPipelineSteps: PropTypes.bool,
    hasExtensions: PropTypes.bool,
    excerpt: PropTypes.string,
    gav: PropTypes.string.isRequired,
    hasBomEntry: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.string),
    developers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    })),
    name: PropTypes.string.isRequired,
    requiredCore: PropTypes.string,
    scm: PropTypes.string,
    securityWarnings: PropTypes.arrayOf(PropTypes.shape({
        active: PropTypes.bool,
        id: PropTypes.string,
        message: PropTypes.string,
        url: PropTypes.string,
        versions: PropTypes.arrayOf(PropTypes.shape({
            firstVersion: PropTypes.string,
            lastVersion: PropTypes.string,
        }))
    })),
    sha1: PropTypes.string,
    stats: PropTypes.shape({
        currentInstalls: PropTypes.number,
        installations: PropTypes.arrayOf(PropTypes.shape({
            timestamp: PropTypes.number,
            total: PropTypes.number,
            percentage: PropTypes.number
        }))
    }).isRequired,
    title: PropTypes.string.isRequired,
    wiki: PropTypes.shape({
        content: PropTypes.string,
        url: PropTypes.string
    }).isRequired,
    version: PropTypes.string
});
