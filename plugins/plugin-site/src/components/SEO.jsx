import React from 'react';
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';
import {useStaticQuery, graphql} from 'gatsby';

const urlResolve = (base, url) => new URL(url, base).toString();

const SEO = ({title, description, image, pathname, article}) => {
    const data = useStaticQuery(query);
    if (!data) { return null; }

    const {
        site: {
            siteMetadata: {
                defaultTitle,
                titleTemplate,
                defaultDescription,
                siteUrl,
                defaultImage,
                twitterUsername,
            },
        },
    } = data;
    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: urlResolve(siteUrl, image || defaultImage),
        url: urlResolve(siteUrl, pathname || '/'),
    };
    return (
        <>
            <Helmet title={seo.title} titleTemplate={seo.title === defaultTitle ? '%s' : titleTemplate}>
                <meta name="description" content={seo.description} />
                <meta name="image" content={seo.image} />
                {seo.url && <meta property="og:url" content={seo.url} />}
                {(article ? true : null) && (
                    <meta property="og:type" content="article" />
                )}
                {seo.title && <meta property="og:site_name" content={seo.title} />}
                {seo.title && <meta property="og:title" content={seo.title} />}
                {seo.title && <meta property="apple-mobile-web-app-title" content={seo.title} />}
                {seo.description && (
                    <meta property="og:description" content={seo.description} />
                )}
                {seo.image && <meta property="og:image" content={seo.image} />}
                <meta name="twitter:card" content="summary_large_image" />
                {twitterUsername && (
                    <meta name="twitter:creator" content={twitterUsername} />
                )}
                {seo.title && <meta name="twitter:title" content={seo.title} />}
                {seo.description && (
                    <meta name="twitter:description" content={seo.description} />
                )}
                {seo.image && <meta name="twitter:image" content={seo.image} />}
            </Helmet>
        </>
    );
};

export default SEO;

SEO.displayName = 'SEO';

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    pathname: PropTypes.string,
    article: PropTypes.bool,
};

SEO.defaultProps = {
    title: null,
    description: null,
    image: null,
    pathname: null,
    article: false,
};

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl: url
        defaultImage: image
        twitterUsername
      }
    }
  }
`
;
