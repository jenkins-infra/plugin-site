import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';

import classNames from 'classnames';
import {Helmet} from 'react-helmet';

import Layout from '../layout';
import styles from '../styles/Main.css';
import PluginLink from './PluginLink';

function Footer() {

    const data = useStaticQuery(graphql`
      query {
        categories: allJenkinsPluginCategory {
          edges {
            node {
              id
              title
            }
          }
        }
        newly: allJenkinsPlugin(sort: {fields: firstRelease, order: DESC}, limit: 10, filter: {firstRelease: {ne: null}}) {
          edges {
            node {
              title
              name
              firstRelease
            }
          }
        }
        updated: allJenkinsPlugin(sort: {fields: releaseTimestamp, order: DESC}, limit: 10, filter: {releaseTimestamp: { ne: null }}) {
          edges {
            node {
              title
              name
              firstRelease
            }
          }
        }
        trend: allJenkinsPlugin(sort: {fields: stats___trend}, limit: 10) {
          edges {
            node {
              title
              name
              firstRelease
            }
          }
        }
      }
  `);

    const handleOnClick = (event) => {
        event.preventDefault();
        const categoryId = event.target.getAttribute('data-id');
        this.props.setCategory(categoryId);
    };

    return (
        <Layout>
            <Helmet>
                <title>Jenkins Plugins</title>
                <meta content="Jenkins Plugins" name="apple-mobile-web-app-title" />
                <meta content="Jenkins Plugins" name="twitter:title" />
                <meta content="Jenkins Plugins" property="og:title" />
                <meta content="Jenkins plugins" property="og:site_name" />
            </Helmet>
            <div className="NoLabels">
                <div className="container">
                    <div className="row">
                        <div className={classNames(styles.NoLabels, 'col-md-3 NoLabels')}>
                            <fieldset>
                                <legend>Browse categories</legend>
                                { data.categories.edges.map(({node: category}) => {
                                    return(
                                        <div key={`cat-box-id-${category.id}`} className="Entry-box">
                                            <a href="#" onClick={handleOnClick} data-id={category.id}>{category.title}</a>
                                        </div>
                                    );
                                })}
                            </fieldset>
                        </div>
                        <div className="col-md-3">
                            <fieldset>
                                <legend>New Plugins</legend>
                                { data.newly.edges.map(({node: plugin}) => {
                                    return <PluginLink key={plugin.name} name={plugin.name} title={plugin.title} />;
                                })}
                            </fieldset>
                        </div>
                        <div className="col-md-3">
                            <fieldset>
                                <legend>Recently updated</legend>
                                { data.updated.edges.map(({node: plugin}) => {
                                    return <PluginLink key={plugin.name} name={plugin.name} title={plugin.title} />;
                                })}
                            </fieldset>
                        </div>
                        <div className="col-md-3">
                            <fieldset>
                                <legend>Trending</legend>
                                { data.trend.edges.map(({node: plugin}) => {
                                    return <PluginLink key={plugin.name} name={plugin.name} title={plugin.title} />;
                                })}
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Footer;
