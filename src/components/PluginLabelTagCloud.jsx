import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {TagCloud} from 'react-tagcloud';

function PluginLabelTagCloud() {

    const allLabels = useStaticQuery(graphql`
        query {
            labels: allJenkinsPlugin {
                nodes {
                  labels
                }
            }
        }
    `).labels.nodes.reduce((prev, nodes) => {

        nodes.labels.reduce((prevLabel, obj) => {
            if (!prev[obj]) {
                prev[obj] = 1;
            } else {
                prev[obj]++;
            }
            return obj;

        }, {});

        return prev;
    }, {});

    const tags = new Array();
    Object.entries(allLabels).forEach(([value, count]) => {
        tags.push({value, count});
    });

    return (
        <TagCloud
            minSize={12}
            maxSize={35}
            tags={tags}
            onClick={tag => document.location.href=`/ui/search/?labels=${tag.value}`}
        />
    );

}

PluginLabelTagCloud.propTypes = {

};

export default PluginLabelTagCloud;
