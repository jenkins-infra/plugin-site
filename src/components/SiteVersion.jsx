import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';

function SiteVersion() {

    const data = useStaticQuery(graphql`
        query {
            jenkinsPluginSiteInfo {
                api {
                    commit
                }
                website {
                    commit
                }
            }
        }
    `);
    const pluginSiteApiVersion = data.jenkinsPluginSiteInfo.api.commit;
    const pluginSiteVersion = data.jenkinsPluginSiteInfo.website.commit;

    return (
        <p>
            {'UI '}
            <a href={`https://github.com/jenkins-infra/plugin-site/commit/${pluginSiteVersion}`}>{pluginSiteVersion.substr(0,7)}</a>
            {' / API '}
            <a href={`https://github.com/jenkins-infra/plugin-site-api/commit/${pluginSiteApiVersion}`}>{pluginSiteApiVersion.substr(0, 7)}</a>
        </p>
    );
}

export default SiteVersion;
