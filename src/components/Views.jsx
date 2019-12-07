import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import { view } from '../selectors';
import View from './View';
import { createSelector } from 'reselect';

const views = ['Tiles', 'List', 'Table'];

class Views extends React.PureComponent {

  static propTypes = {
    setView: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired
  };

  render() {
    return (
      <fieldset className="btn-group">
        { views.map((view, index) => {
          return (
            <View
              key={index}
              isActive={view === this.props.view}
              updateView={this.props.setView}
              view={view}
            />
          );
        })}
      </fieldset>
    );
  }

}

const selectors = createSelector(
  [ view ],
  ( view ) =>
  ({ view })
);

export default connect(selectors, actions)(Views);
