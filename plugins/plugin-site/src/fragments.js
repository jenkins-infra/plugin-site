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
        childHtmlRehype {
            html
            rehypeTOC: tableOfContents
        }
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
    deprecationNotice
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
      type
      viewUrl
    }
    scm
    hasPipelineSteps
    hasExtensions
    requiredCore
    releaseTimestamp
    previousVersion
    previousTimestamp
    name
    labels
    developers {
      id
      name
    }
    firstRelease
    excerpt
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
