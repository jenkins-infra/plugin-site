function pluginQueries() {
    const pageQuery = `{
      pages: allJenkinsPlugin {
        edges {
          node {
            id
            title
            wiki {
              content
            }
            name
            categories
            excerpt
            labels
            stats {
              currentInstalls
              trend
            }
            maintainers {
              email
              name
              id
            }
            version
          }
        }
      }
    }
    `;
    function pageToAlgoliaRecord({node: {id, wiki: {content}, stats: {currentInstalls, trend}, ...rest}}) {
        return {
            objectID: id,
            slug: `/${id.trim()}/`,
            content: content.substr(0, 5000),
            currentInstalls,
            trend,
            ...rest,
        };
    }
    return {
        query: pageQuery,
        transformer: ({data}) => data.pages.edges.map(pageToAlgoliaRecord),
        indexName: 'Plugins',
        settings: {attributesToSnippet: ['content:20']},
    };
}

const queries = [
    pluginQueries(),
];
module.exports = queries;
