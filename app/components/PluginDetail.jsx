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
          <Link to={`/${dependency.name}`}>{dependency.name} v.{dependency.version} <span className="req">({required})</span></Link>
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
                    <span className="v">{plugin.version}</span>
                    <span className="sub">Minimum Jenkins requirement: {plugin.requiredCore}</span>
                    <span className="sub">ID: {plugin.name}</span>
                  </h1>
                  <div className="row flex">
                    <div className="col-md-4">
                      <p>
                        Installs: {plugin.stats.currentInstalls}<br />
                        Last released: <span  title={moment(plugin.releaseTimestamp).format('dddd, MMMM Do YYYY')}>
                          {moment(plugin.releaseTimestamp).fromNow()}</span><br/>
                      </p>
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
                  <div className="content" dangerouslySetInnerHTML={{__html: plugin.wiki.content}} />
                </div>
              </div>
              <div className="col-md-3 gutter">
                <a href={`https://updates.jenkins-ci.org/download/plugins/${plugin.name}` }
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
