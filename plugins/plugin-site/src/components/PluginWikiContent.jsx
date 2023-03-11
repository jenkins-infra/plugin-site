import React from 'react';
import PropTypes from 'prop-types';

const PluginWikiContent = ({wiki}) => {
    if (wiki?.childHtmlRehype) {
        return <div className="content" dangerouslySetInnerHTML={{__html: wiki.childHtmlRehype.html}} />;
    }
    return (<div className="content">
        Documentation for this plugin is here:
        {' '}
        <a href={wiki.url}>{wiki.url}</a>
    </div>);
};
PluginWikiContent.displayName = 'PluginWikiContent';
PluginWikiContent.propTypes = {
    wiki: PropTypes.shape({
        childHtmlRehype: PropTypes.shape({
            html: PropTypes.string,
        }),
        url: PropTypes.string.isRequired
    }).isRequired,
};

export default PluginWikiContent;
