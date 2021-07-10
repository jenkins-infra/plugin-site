import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';

function SiteVersion() {

    const data = useStaticQuery(graphql`
        query {
            site {
                buildTime
            }
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
    const buildTime = data.site.buildTime;

    return (
        <p>
            {'UI '}
            <a href={`https://github.com/jenkins-infra/plugin-site/commit/${pluginSiteVersion}`}>{pluginSiteVersion.substr(0, 7)}</a>
            {' / API '}
            <a href={`https://github.com/jenkins-infra/plugin-site-api/commit/${pluginSiteApiVersion}`}>{pluginSiteApiVersion.substr(0, 7)}</a>
            <br />
            <small>{buildTime}</small>
        </p>
    );
}

export default SiteVersion;
