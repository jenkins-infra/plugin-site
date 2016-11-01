import React, { PropTypes } from 'react';
import DevTools from './DevTools';

export default class App extends React.Component {

  static propTypes = {
    children: PropTypes.any,
  };

  render() {
    return (
      <div>
          {this.props.children}
          <DevTools />
      </div>
    );
  }
}
