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
            developers {
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
        synonyms: [
            {
                type: 'synonym',
                synonyms: ['perforce','p4'],
                objectID: 'syn-1617250859718-18'
            }
        ],
        settings: {
            paginationLimitedTo: 2000, // they recommend 1000, to keep speed up and prevent people from scraping, but both are fine to us
            attributesToSnippet: ['content:20'],
            optionalWords: [
                'jenkins',
                'plugin',
                'plugins'
            ],
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
                'developers.name',
                'developers.id',
            ],
        },
    };
}

const queries = [
    pluginQueries(),
];
module.exports = queries;
