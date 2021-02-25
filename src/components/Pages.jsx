import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';

export default class Pages extends React.PureComponent {

  static propTypes = {
      current: PropTypes.number.isRequired,
      pages: PropTypes.number.isRequired,
      pagesToDisplay: PropTypes.number.isRequired,
      updatePage: PropTypes.func.isRequired
  };

  render() {
      const {updatePage, current, pages} = this.props;
      const handlePageClick = (data) => updatePage(data.selected);

      return (
          <ReactPaginate
              pageCount={pages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={this.props.pagesToDisplay}
              onPageChange={handlePageClick}
              forcePage={current}

              breakLabel={'...'}
              breakClassName={'page-item disabled'}
              breakLinkClassName={'page-link'}

              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}

              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
          />
      );
  }
}
