function pluginQueries() {
    const pageQuery = `{
      pages: allJenkinsPlugin {
        edges {
          node {
            id
            title
            name
            excerpt
            labels
            stats {
              currentInstalls
              trend
            }
            healthScore {
                value
                    version
                    details {
                        key
                        value
                        coefficient
                    }
                    timestamp
            }
            developers {
              name
              id
            }
            releaseTimestamp
            version
          }
        }
      }
    }
    `;
    function pageToAlgoliaRecord({node: {id, ...rest}}) {
        return {
            objectID: id,
            slug: `/${id.trim()}/`,
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
                synonyms: ['perforce', 'p4'],
                objectID: 'syn-1617250859718-18'
            }
        ],
        settings: {
            paginationLimitedTo: 2000, // they recommend 1000, to keep speed up and prevent people from scraping, but both are fine to us
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
                'labels'
            ],
            attributesToIndex: [
                'name',
                'title',
                'developers.name',
                'developers.id',
                'excerpt'
            ],
        },
    };
}

const queries = [
    pluginQueries(),
];
module.exports = queries;
