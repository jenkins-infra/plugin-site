import {graphql} from 'gatsby';

export const PluginFragment = graphql`
  fragment JenkinsPluginFragment on JenkinsPlugin {
    id
    gav
    title
    url
    version
    suspended
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
    scm {
      link
    }
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
