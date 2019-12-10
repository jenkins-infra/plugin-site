import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'gatsby';
import classNames from 'classnames';

import styles from '../styles/main.module.css';
import Icon from './Icon';
import {cleanTitle} from '../commons/helper';
import PluginMaintainers from '../components/PluginMaintainers';
import PluginLabels from '../components/PluginLabels';

function Maintainers({maintainers}) {
    return (
        <>
            <PluginMaintainers maintainers={maintainers.slice(0, 2)} />
            {maintainers.length > 2 && (
                <div key="more_maintainers">
                    {`(${maintainers.length - 2} other contributers)`}
                </div>
            )}
        </>
    );
}

Maintainers.propTypes = PluginMaintainers.propTypes;

function Plugin({plugin: {name, title, wiki, stats, version, requiredCore, labels, excerpt, maintainers}}) {
    return (
        <Link to={`/${name}`} className={classNames('item', 'Entry', styles.Tile)}>
            <div className={classNames(styles.Icon, 'Icon')}>
                <Icon title={title} />
            </div>
            <div className={classNames(styles.Title, 'Title')}>
                <h4>{cleanTitle(title)}</h4>
            </div>
            <div className={classNames(styles.Wiki, 'Wiki')}>
                {wiki.url}
            </div>
            <div className={classNames(styles.Downloads, 'Downloads Installs')}>
                {'Installs:  '}
                {stats.currentInstalls}
            </div>
            <div className={classNames(styles.Version, 'Version')}>
                <span className={classNames(styles.v, 'v')}>{version}</span>
                <span className="jc">
                    <span className="j">Jenkins</span>
                    <span className="c">
                        {requiredCore}
                        {' +'}
                    </span>
                </span>
            </div>
            <div className={classNames(styles.Labels, 'Labels')}>
                <PluginLabels labels={labels} />
            </div>
            <div className={classNames(styles.Excerpt, 'Excerpt')} dangerouslySetInnerHTML={{__html: excerpt}} />
            <div className={classNames(styles.Authors, 'Authors')}>
                <PluginMaintainers maintainers={maintainers} />
            </div>
        </Link>
    );
}

Plugin.propTypes = {
    plugin: PropTypes.shape({
        excerpt: PropTypes.string,
        labels: PropTypes.arrayOf(PropTypes.string),
        maintainers: PropTypes.arrayOf(PropTypes.shape({
            email: PropTypes.string,
            id: PropTypes.string,
            name: PropTypes.string
        })),
        name: PropTypes.string.isRequired,
        requiredCore: PropTypes.string,
        sha1: PropTypes.string,
        stats: PropTypes.shape({
            currentInstalls: PropTypes.number
        }).isRequired,
        title: PropTypes.string.isRequired,
        wiki: PropTypes.shape({
            url: PropTypes.string
        }).isRequire,
        version: PropTypes.string
    }).isRequired
};

export default Plugin;
