import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Pages from './Pages';
import { actions } from '../actions';
import { limit, page, pages, total } from '../selectors';
import { createSelector } from 'reselect';

class Pagination extends React.PureComponent {

  static propTypes = {
    limit: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired
  }

  render() {
    const { limit, page, pages, total, setPage } = this.props;
    const start = (limit * page) - (limit - 1);
    const end = limit * page <= total ? limit * page : total;
    return (
      <li className="nav-item page-picker">
        {total > 0 &&
          <span className="nav-link">
            {start} to&nbsp;
            {end} of {total}
          </span>
        }
        {total > 0 && pages > 1 &&
          <Pages
            current={page}
            pages={pages}
            pagesToDisplay={5}
            updatePage={setPage}
          />
        }
      </li>
    );
  }

}

const selectors = createSelector(
  [ limit, page, pages, total ],
  ( limit, page, pages, total ) =>
  ({ limit, page, pages, total })
);

export default connect(selectors, actions)(Pagination);
