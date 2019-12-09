import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export default class Page extends React.PureComponent {

  static propTypes = {
      className: PropTypes.string.isRequired,
      display: PropTypes.any.isRequired,
      isCurrent: PropTypes.bool,
      page: PropTypes.number.isRequired,
      updatePage: PropTypes.func.isRequired
  };

  static defaultProps = {
      isCurrent: false
  };

  handleOnClick = (event) => {
      event.preventDefault();
      this.props.updatePage(this.props.page);
  }

  render() {
      return (
          <li className={classNames('page-item', {active: this.props.isCurrent})}>
              <a className="page-link" aria-label={this.props.className} onClick={this.handleOnClick}
                  dangerouslySetInnerHTML={{__html: this.props.display}} />
          </li>
      );
  }

}
