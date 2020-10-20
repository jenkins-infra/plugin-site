import React from 'react';
import {useStaticQuery, graphql, navigate} from 'gatsby';
import {TagCloud} from 'react-tagcloud';
import './PluginLabelTagCloud.css';

function PluginLabelTagCloud() {

    const excludedLabelSet = new Set(['adopt-this-plugin','deprecated','must-be-labeled','plugin-test']);

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
            if(!excludedLabelSet.has(obj)) {
                prev[obj] = (prev[obj] || 0) + 1;
            }
            return obj;

        }, {});

        return prev;
    }, {});

    const tags = Object.entries(allLabels).map(([value, count]) => {return {value, count};});

    return (
        <div id="pluginLabelTagCloud--container" className="container">
            <TagCloud
                minSize={12}
                maxSize={35}
                tags={tags}
                onClick={tag => navigate(`/ui/search/?labels=${tag.value}`)}
                colorOptions={{luminosity: 'dark',format: 'rgba',alpha: 1.0}}
            />
        </div>
    );

}

PluginLabelTagCloud.propTypes = {

};

export default PluginLabelTagCloud;
