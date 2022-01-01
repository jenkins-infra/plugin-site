import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import TimeAgo from 'react-timeago';
import {formatter} from '../commons/helper';

function SiteVersion() {

    const data = useStaticQuery(graphql`
        query {
            site {
                buildTime
            }
            jenkinsPluginSiteInfo {
                website {
                    commit
                }
            }
        }
    `);
    if (!data) { return null; }
    const pluginSiteVersion = data.jenkinsPluginSiteInfo.website.commit;
    const buildTime = data.site.buildTime;

    return (
        <p>
            {'UI '}
            <a href={`https://github.com/jenkins-infra/plugin-site/commit/${pluginSiteVersion}`}>{pluginSiteVersion.substr(0, 7)}</a>
            <br />
            <small>
                Last Built:
                {typeof window !== 'undefined' ? <TimeAgo date={new Date(buildTime)} formatter={formatter}/> : buildTime}
            </small>
        </p>
    );
}

export default SiteVersion;
