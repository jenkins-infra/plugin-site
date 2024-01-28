import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const PluginWikiContent = ({wiki}) => {
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Reset the image if clicked outside the content area
            if (isClicked && !event.target.closest('.content')) {
                resetImage();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isClicked]);

    const resetImage = () => {
        const image = document.getElementById('imageResize');
        if (image) {
            image.removeAttribute('id');
            setIsClicked(false);
        }
    };

    const handleClick = (event) => {
        // Toggle the isClicked state for the specific image
        setIsClicked(!isClicked);

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
            const imgElement = parentNode.querySelector('img');
            if (imgElement) {
                if (imgElement.id === 'imageResize') {
                    imgElement.removeAttribute('id');
                    setIsClicked(false);
                } else {
                    imgElement.id = 'imageResize';
                    setIsClicked(true);
                }
            }
        }
    };

    if (wiki?.childHtmlRehype) {
        const {html} = wiki.childHtmlRehype;

        return (
            <div className="content" onClick={handleClick} style={getStyle()}>
                <style>
                    {`
                    #imageResize {
                        width: auto;
                        height: auto;
                        transition: width 0.3s ease, height 0.3s ease;
                        max-width: 100vw;
                        max-height: 100vh;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        z-index: 9999;
                    }
                    .lightbox-overlay {
                        display: ${isClicked ? 'block' : 'none'};
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 9998;
                    }
                `}
                </style>
                <div dangerouslySetInnerHTML={{__html: html}} />
                {isClicked && document.getElementById('imageResize') && (
                    <div className="lightbox-overlay" onClick={resetImage} />
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

const getStyle = () => (
    {display: 'block', position: 'relative'}
);

export default PluginWikiContent;
