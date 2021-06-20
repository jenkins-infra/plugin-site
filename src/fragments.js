import {graphql} from 'gatsby';

export const PluginFragment = graphql`
  fragment JenkinsPluginFragment on JenkinsPlugin {
    id
    gav
    hasBomEntry
    title
    url
    version
    wiki {
      content
      url
    }
    stats {
      currentInstalls
      installations {
          timestamp
          total
      }
      trend
    }
    sha1
    securityWarnings {
      active
      id
      message
      url
      versions {
        firstVersion
        lastVersion
      }
    }
    issueTrackers {
      reportUrl
      viewUrl
    }
    scm
    hasPipelineSteps
    requiredCore
    releaseTimestamp
    previousVersion
    previousTimestamp
    name
    labels
    maintainers {
      id
      name
    }
    firstRelease
    excerpt
    categories
    buildDate
    dependencies {
      implied
      name
      optional
      title
      version
    }
  }
`;
