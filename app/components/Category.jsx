import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from '../styles/Main.css';
import Label from './Label';
import { actions } from '../actions';
import { activeCategories, labels } from '../selectors';
import { createSelector } from 'reselect';

class Category extends React.PureComponent {

  static propTypes = {
    activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.shape({
      id: PropTypes.string.isRequired,
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string
    })).isRequired,
    toggleCategory: PropTypes.func.isRequired
  };

  handleOnChange = () => {
    this.props.toggleCategory(this.props.category);
  }

  render() {
    const { activeCategories, category, labels } = this.props;
    const matchedLabels = category.labels.map((id) => labels.find((label) => label.id === id));
    const checked = activeCategories.find((active) => active === category.id) !== undefined;
    return (
      <li className={classNames(styles[category.id], category.id, { mask: checked })}>
        <label>
          <input type="checkbox" name="categories" value={category.id}
            checked={checked} onChange={this.handleOnChange}/>
          <span>{category.title}</span>
        </label>
        <ul>
          {matchedLabels.map((label) => {
            return(
              <Label
                key={label.id}
                category={category.id}
                label={label}
              />
            );
          })}
        </ul>
      </li>
    );
  }
}

const selectors = createSelector(
  [ activeCategories, labels ],
  ( activeCategories, labels ) =>
  ({ activeCategories, labels })
);

export default connect(selectors, actions)(Category);
