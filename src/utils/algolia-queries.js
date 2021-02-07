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
            requiredCore
            version
          }
        }
      }
    }
    `;
    function pageToAlgoliaRecord({node: {id, wiki: {content}, ...rest}}) {
        return {
            objectID: id,
            slug: `/${id.trim()}/`,
            wiki: {
                content: content.substr(0, 5000),
            },
            ...rest,
        };
    }
    return {
        query: pageQuery,
        transformer: ({data}) => data.pages.edges.map(pageToAlgoliaRecord),
        indexName: 'Plugins',
        settings: {
            attributesToSnippet: ['content:20'],
            ranking: [
                'typo',
                'geo',
                'words',
                'filters',
                'proximity',
                'attribute',
                'exact',
                'custom'
            ],
            customRanking: [
                'desc(stats.currentInstalls)'
            ],
            attributesForFaceting: [
                'categories',
                'labels'
            ],
            attributesToIndex: [
                'name',
                'title',
                'maintainers.name',
                'maintainers.id',
            ],
        },
    };
}

const queries = [
    pluginQueries(),
];
module.exports = queries;
