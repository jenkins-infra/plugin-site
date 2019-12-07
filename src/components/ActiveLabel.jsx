import React, {PropTypes} from 'react';

export default class ActiveLabel extends React.PureComponent {

  static propTypes = {
      label: PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string
      }),
      toggleLabel: PropTypes.func.isRequired
  };

  handleOnClick = (event) => {
      event.preventDefault();
      this.props.toggleLabel(this.props.label);
  }

  render() {
      const {label} = this.props;
      if (label === undefined) {
          return null;
      }
      const text = label.title !== null ? label.title : label.id;
      return (
          <a className="nav-link" onClick={this.handleOnClick}>{text}</a>
      );
  }

}
