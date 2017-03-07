import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ModalView, {Body, Header} from 'react-header-modal';
import { browserHistory, Link } from 'react-router';
import moment from 'moment';
import LineChart from './LineChart';
import NotFound from './NotFound';
import { cleanTitle } from '../commons/helper';
import { firstVisit, isFetchingPlugin, labels, plugin } from '../selectors';
import { actions } from '../actions';
import { createSelector } from 'reselect';

class PluginDetail extends React.PureComponent {

  // This is ultimately called in server.js to ensure the plugin is loaded prior to rendering
  // so the plugin, including wiki content, is rendered in the response from the server. Thus
  // making this SEO friendly.
  static fetchData({ store, location, params, history }) {  // eslint-disable-line no-unused-vars
    return store.dispatch(actions.getPlugin(params.pluginName));
  }

  static propTypes = {
    clearFirstVisit: PropTypes.func.isRequired,
    clearPlugin: PropTypes.func.isRequired,
    firstVisit: PropTypes.bool.isRequired,
    getPlugin: PropTypes.func.isRequired,
    isFetchingPlugin: PropTypes.bool.isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string
    })).isRequired,
    plugin: PropTypes.shape({
      dependencies: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        optional: PropTypes.bool,
        version: PropTypes.string
      })),
      excerpt: PropTypes.string,
      labels: PropTypes.arrayOf(PropTypes.string),
      maintainers: PropTypes.arrayOf(PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string
      })),
      name: PropTypes.string.isRequired,
      requiredCore: PropTypes.string,
      scm: PropTypes.shape({
        inLatestRelease: PropTypes.string,
        issues: PropTypes.string,
        link: PropTypes.string,
        pullRequests: PropTypes.string,
        sinceLatestRelease: PropTypes.string
      }),
      securityWarnings: PropTypes.arrayOf(PropTypes.shape({
        active: PropTypes.boolean,
        firstVersion: PropTypes.string,
        id: PropTypes.string,
        lastVersion: PropTypes.string,
        message: PropTypes.string,
        url: PropTypes.string
      })),
      sha1: PropTypes.string,
      stats: PropTypes.shape({
        currentInstalls: PropTypes.number.isRequired,
        installations: PropTypes.arrayOf(PropTypes.shape({
          timestamp: PropTypes.number,
          total: PropTypes.number
        })).isRequired
      }).isRequired,
      title: PropTypes.string.isRequired,
      wiki: PropTypes.shape({
        content: PropTypes.string,
        url: PropTypes.string
      }).isRequired,
      version: PropTypes.string
    })
  };

  componentDidMount() {
    if (this.props.plugin === null) {
      this.props.getPlugin(this.props.params.pluginName);
    }
  }

  componentWillUnmount() {
    this.props.clearPlugin();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.pluginName !== nextProps.params.pluginName) {
      this.props.getPlugin(nextProps.params.pluginName);
    }
  }

  closeDialog = (event) => {
    event && event.preventDefault();
    if (this.props.firstVisit) {
      this.props.clearFirstVisit();
      browserHistory.push('/');
    } else {
      browserHistory.goBack();
    }
  }

  getDependencies(dependencies) {
    if (!dependencies || dependencies.length === 0) {
      return (<div className="empty">No dependencies found</div>);
    }

    return dependencies.sort((a, b) => a.optional === b.optional ? 0 : (a.optional ? 1 : -1)).map((dependency) => {
      const required = !dependency.optional ? 'required' : 'optional';
      return (
        <div key={dependency.name} className={required}>
          <Link to={`/${dependency.name}`}>{dependency.title} v.{dependency.version} <span className="req">({required})</span></Link>
        </div>
      );
    });
  }

  getLabels(labels) {
    if (!labels || labels.length === 0) {
      return (<div className="empty">This plugin has no labels</div>);
    }
    return labels.map((id) => {
      const label = this.props.labels.find((label) => label.id === id);
      const text = label !== undefined ? label.title : id;
      return (
        <div className="label-link" key={id}>
          <Link to={`/?labels=${id}`}>{text}</Link>
        </div>
      );
    });
  }

  getMaintainers(maintainers) {
    return maintainers.map((maintainer) => {
      // TODO: Adjust Main.state to add to maintainers filter
      const name = maintainer.name || maintainer.id;
      return <div className="maintainer" key={maintainer.id}>{name}</div>;
    });
  }

  getLastReleased(plugin) {
    const getTime = (plugin) => {
      if (plugin.releaseTimestamp !== null) {
        // 2017-02-09T15:19:10.00Z
        return moment(plugin.releaseTimestamp);
      } else {
        // 2017-02-09
        return moment(plugin.buildDate, 'YYYY-MM-DD');
      }
    }
    const time = getTime(plugin);
    return (
      <div>Last released: <span  title={time.format('dddd, MMMM Do YYYY')}>
        {time.fromNow()}</span>
      </div>
    );
  }

  showWikiUrl(url) {
    return url && url.startsWith("https://wiki.jenkins-ci.org");
  }

  showWarnings = () => {
    this.warningsModal.show();
  }

  getActiveWarnings(securityWarnings) {
    if (!securityWarnings) {
      return null;
    }
    const active = securityWarnings.find(warning => warning.active);
    if (active) {
      return (
        <div className="badge-box">
          <span className="badge active warning" onClick={this.showWarnings}></span>
          <ModalView hideOnOverlayClicked ignoreEscapeKey ref={(modal) => { this.warningsModal = modal; }}>
            <Header>
              <div>{active.id}</div>
            </Header>
            <Body>
              <div>
                <a href={active.url}>{active.message}</a>
              </div>
            </Body>
          </ModalView>
        </div>
      );
    }
  }

  getInactiveWarnings(securityWarnings) {
    if (!securityWarnings || securityWarnings.length == 0) {
      return null;
    }
    const renderedWarnings = securityWarnings.map(warning => {
      const version = warning.firstVersion && warning.lastVersion
        ? `versions ${warning.firstVersion} - ${warning.lastVersion}`
        : `version ${warning.firstVersion ? warning.firstVersion : warning.lastVersion}`;
      return (
        <li key={warning.id}>
          <h7>{warning.id}</h7>
          <p><a href={warning.url}>{warning.message}</a> affecting {version}</p>
        </li>
      )
    });
    return (
      <div>
        <h6>Previous Security Warnings</h6>
        <ul>
          {renderedWarnings}
        </ul>
      </div>
    )
  }

  render() {
    const { isFetchingPlugin, plugin } = this.props;
    if (plugin === null) {
      if (isFetchingPlugin) {
        return null;
      } else {
        return <NotFound/>;
      }
    }
    const beforeClose = this.closeDialog;
    return (
      <ModalView hideOnOverlayClicked isVisible ignoreEscapeKey {...{beforeClose}}>
        <Header>
          <div className="back" onClick={beforeClose}>Find plugins</div>
        </Header>
        <Body>
          <div>
            <div className="row flex">
              <div className="col-md-9 main">
                <div className="container-fluid padded">
                  <h1 className="title">
                    {cleanTitle(plugin.title)}
                    {this.getActiveWarnings(plugin.securityWarnings)}
                    <span className="v">{plugin.version}</span>
                    <span className="sub">Minimum Jenkins requirement: {plugin.requiredCore}</span>
                    <span className="sub">ID: {plugin.name}</span>
                  </h1>
                  <div className="row flex">
                    <div className="col-md-4">
                      {plugin.stats &&  <div>Installs: {plugin.stats.currentInstalls}</div>}
                      {plugin.scm && plugin.scm.link && <div><a href={plugin.scm.link}>GitHub →</a></div>}
                      {plugin.scm && plugin.scm.issues && <div><a href={plugin.scm.issues}>Open Issues →</a></div>}
                      {plugin.scm && plugin.scm.sinceLatestRelease && <div><a href={plugin.scm.sinceLatestRelease}>Lastest rolling changes →</a></div>}
                      {plugin.scm && plugin.scm.inLatestRelease && <div><a href={plugin.scm.inLatestRelease}>Changes in {plugin.version} release →</a></div>}
                      {this.getLastReleased(plugin)}
                    </div>
                    <div className="col-md-4 maintainers">
                      <h5>Maintainers</h5>
                      {this.getMaintainers(plugin.maintainers)}
                    </div>
                    <div className="col-md-4 dependencies">
                      <h5>Dependencies</h5>
                      {this.getDependencies(plugin.dependencies)}
                    </div>
                  </div>
                  {plugin.wiki.content && <div className="content" dangerouslySetInnerHTML={{__html: plugin.wiki.content}} />}
                </div>
              </div>
              <div className="col-md-3 gutter">
                <a href={`https://updates.jenkins.io/download/plugins/${plugin.name}` }
                    className="btn btn-secondary">
                  <i className="icon-box" />
                  <span>Archives</span>
                  <span className="v">Get past versions</span>
                </a>
                <div className="chart">
                  <LineChart
                    total={plugin.stats.currentInstalls}
                    installations={plugin.stats.installations}
                  />
                </div>
                <h5>Labels</h5>
                {this.getLabels(plugin.labels)}
                {this.showWikiUrl(plugin.wiki.url) &&
                  <div className="update-link">
                    <h6>Are you maintaining this plugin?</h6>
                    <p>Visit the <a href={plugin.wiki.url} target="_wiki">Jenkins Plugin Wiki</a> to edit this content.</p>
                  </div>
                }
                {this.getInactiveWarnings(plugin.securityWarnings)}
              </div>
            </div>
          </div>
        </Body>
      </ModalView>
    );
  }
}

const selectors = createSelector(
  [ firstVisit, isFetchingPlugin, labels, plugin ],
  ( firstVisit, isFetchingPlugin, labels, plugin ) =>
  ({ firstVisit, isFetchingPlugin, labels, plugin })
);

export default connect(selectors, actions)(PluginDetail);
