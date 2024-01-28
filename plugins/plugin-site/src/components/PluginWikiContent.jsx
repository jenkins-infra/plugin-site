import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {imageResize, lightboxOverlay} from './PluginWikiContent.module.css';

const PluginWikiContent = ({wiki}) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Reset the image if clicked outside the content area
            if (isLightboxOpen && !event.target.closest('.content')) {
                resetImage();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isLightboxOpen]);

    const resetImage = () => {
        const images = document.getElementsByClassName(imageResize);
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            image.removeAttribute('class');
        }
        setIsLightboxOpen(false);
    };

    const handleClick = (event) => {

        // Find the parent <a> tag with target="_blank"
        let parentNode = event.target.parentNode;
        while (parentNode && parentNode.tagName !== 'A') {
            parentNode = parentNode.parentNode;
        }

        // If a parent <a> tag is found, set the id attribute of the <img> tag inside it
        if (
            parentNode &&
            parentNode.tagName === 'A' &&
            parentNode.getAttribute('target') === '_blank'
        ) {
            // Prevent the default behavior of the anchor tag (prevents redirection to github page)
            event.preventDefault();
            // Toggle the isLightboxOpen state for the specific image
            setIsLightboxOpen(!isLightboxOpen);
            const imgElement = parentNode.querySelector('img');
            if (imgElement) {
                if (imgElement.classList.contains(imageResize)) {
                    imgElement.classList.remove(imageResize);
                    setIsLightboxOpen(false);
                } else {
                    imgElement.classList.add(imageResize);
                    setIsLightboxOpen(true);
                }
            }
        }
    };

    if (wiki?.childHtmlRehype) {
        const {html} = wiki.childHtmlRehype;

        return (
            <div className="content" onClick={handleClick}>
                <div dangerouslySetInnerHTML={{__html: html}} />
                {isLightboxOpen && (
                    <div className={lightboxOverlay} onClick={resetImage} />
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
