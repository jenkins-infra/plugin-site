import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from '../styles/Main.css';
import PluginLink from './PluginLink';
import { actions } from '../actions';
import { categories, installed, trend, updated } from '../selectors';
import { createSelector } from 'reselect';

class Footer extends React.PureComponent {

  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired
    })).isRequired,
    installed: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })).isRequired,
    trend: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })).isRequired,
    updated: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })).isRequired,
    setCategory: PropTypes.func.isRequired
  }

  handleOnClick = (event) => {
    event.preventDefault();
    const categoryId = event.target.getAttribute('data-id');
    this.props.setCategory(categoryId);
  }

  render() {
    return(
      <div className="NoLabels">
        <div className="container">
          <div className="row">
            <div className={classNames(styles.NoLabels, 'col-md-3 NoLabels')}>
              <fieldset>
                <legend>Browse categories</legend>
                { this.props.categories.map((category) => {
                  return(
                    <div key={`cat-box-id-${category.id}`} className="Entry-box">
                      <a href="#" onClick={this.handleOnClick} data-id={category.id}>{category.title}</a>
                   </div>
                 );
                })}
              </fieldset>
            </div>
            <div className="col-md-3">
              <fieldset>
                <legend>Most installed</legend>
                { this.props.installed.map((plugin) => {
                  return <PluginLink key={plugin.name} name={plugin.name} title={plugin.title} />;
                })}
              </fieldset>
            </div>
            <div className="col-md-3">
              <fieldset>
                <legend>Recently updated</legend>
                { this.props.updated.map((plugin) => {
                  return <PluginLink key={plugin.name} name={plugin.name} title={plugin.title} />;
                })}
              </fieldset>
            </div>
            <div className="col-md-3">
              <fieldset>
                <legend>Trending</legend>
                { this.props.trend.map((plugin) => {
                  return <PluginLink key={plugin.name} name={plugin.name} title={plugin.title} />;
                })}
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

const selectors = createSelector(
  [ categories, installed, trend, updated ],
  ( categories, installed, trend, updated ) =>
  ({ categories, installed, trend, updated })
);

export default connect(selectors, actions)(Footer);
