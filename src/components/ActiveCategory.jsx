import PropTypes from 'prop-types';
import React from 'react';

export default class ActiveCategory extends React.PureComponent {

  static propTypes = {
      category: PropTypes.shape({
          id: PropTypes.string.isRequired,
          labels: PropTypes.arrayOf(PropTypes.string).isRequired,
          title: PropTypes.string.isRequired
      }),
      toggleCategory: PropTypes.func.isRequired
  };

  handleOnClick = (event) => {
      event.preventDefault();
      this.props.toggleCategory(this.props.category);
  }

  render() {
      const {category} = this.props;
      if (category === undefined) {
          return null;
      }
      return (
          <a className="nav-link" onClick={this.handleOnClick}>{category.title}</a>
      );
  }

}
