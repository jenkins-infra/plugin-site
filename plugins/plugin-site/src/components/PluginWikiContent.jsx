import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {lightbox} from './PluginWikiContent.module.css';

const PluginWikiContent = ({wiki}) => {
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Escape') {
                closeLightbox();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleClick = (event) => {
        // Find the parent <a> tag with target="_blank"
        let parentNode = event.target.parentNode;

        while (parentNode && parentNode.tagName !== 'A') {
            parentNode = parentNode.parentNode;
        }

        if (
            parentNode &&
            parentNode.tagName === 'A' &&
            parentNode.getAttribute('target') === '_blank'
        ) {
            // Prevent the default behavior of the anchor tag from redirecting to the GitHub page
            event.preventDefault();
            const imgSrc = parentNode.querySelector('img').getAttribute('src');
            setLightboxImage(imgSrc);
        }
    };

    const closeLightbox = () => {
        setLightboxImage(null);
    };

    if (wiki?.childHtmlRehype) {
        const html = wiki.childHtmlRehype.html;
        return (
            <div className="content" onClick={handleClick}>
                <div dangerouslySetInnerHTML={{__html: html}} />
                {lightboxImage && (
                    <div className={lightbox} onClick={closeLightbox}>
                        <img src={lightboxImage} alt="Lightbox" />
                    </div>
                )}
            </div>
        );
    }
    if (!wiki) {
        return (<div className="content">No documentation available</div>);
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
