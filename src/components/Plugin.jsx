import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import styles from '../styles/Main.css';
import Icon from './Icon';
import { cleanTitle } from '../commons/helper';

export default class Plugin extends React.PureComponent {

  static propTypes = {
    labels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string
    })).isRequired,
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

  getMaintainer(maintainer) {
    const name = maintainer.name || maintainer.id;
    return <div key={maintainer.id}>{name}</div>;
  }

  getMaintainers() {
    const maintainers = this.props.plugin.maintainers;
    if (maintainers.length > 2) {
      const result = [];
      result.push(this.getMaintainer(maintainers[0]));
      result.push(this.getMaintainer(maintainers[1]));
      result.push(<div key="more_maintainers">({maintainers.length - 2} other contributers)</div>);
      return result;
    } else {
      return maintainers.map((maintainer) => this.getMaintainer(maintainer));
    }
  }

  getLabels() {
    const labels = this.props.plugin.labels.map((id) => {
      return this.props.labels.find((label) => label.id === id);
    }).filter((label) => label !== undefined && label.title !== null);
    return labels.map((label) => {
      const text = label.title.replace(' development', '');
      return <span key={label.id}>{text},</span>;
    });
  }

  render() {
    const plugin = (
      <Link to={`/${this.props.plugin.name}`} className={classNames('item', 'Entry', styles.Tile)}>
      <div className={classNames(styles.Icon, 'Icon')}>
        <Icon title={this.props.plugin.title} />
      </div>
      <div className={classNames(styles.Title, 'Title')}>
        <h4>{cleanTitle(this.props.plugin.title)}</h4>
      </div>
      <div className={classNames(styles.Wiki, 'Wiki')}>
        {this.props.plugin.wiki.url}
      </div>
      <div className={classNames(styles.Downloads, 'Downloads Installs')}>
        Installs: {this.props.plugin.stats.currentInstalls}
      </div>
      <div className={classNames(styles.Version, 'Version')}>
        <span className={classNames(styles.v, 'v')}>{this.props.plugin.version}</span>
        <span className="jc">
          <span className="j">Jenkins</span>
          <span className="c">{this.props.plugin.requiredCore}+</span>
        </span>
      </div>
      <div className={classNames(styles.Labels, 'Labels')}>
        {this.getLabels()}
      </div>
      <div className={classNames(styles.Excerpt, 'Excerpt')}
        dangerouslySetInnerHTML={{__html: this.props.plugin.excerpt}} />
      <div className={classNames(styles.Authors, 'Authors')}>
        {this.getMaintainers()}
      </div>
      </Link>
    );
    return (
      <div key={this.props.plugin.name} className={classNames(styles.Item, 'Entry-box')}>
        {plugin}
      </div>
    );
  }

}
