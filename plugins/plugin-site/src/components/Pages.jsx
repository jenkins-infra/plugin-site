import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from '@halkeye/react-paginate';

export default class Pages extends React.PureComponent {

    static propTypes = {
        current: PropTypes.number.isRequired,
        pages: PropTypes.number.isRequired,
        pagesToDisplay: PropTypes.number.isRequired,
        updatePage: PropTypes.func.isRequired,
        marginPagesDisplayed: PropTypes.number.isRequired
    };

    render() {
        const {updatePage, current, pages, marginPagesDisplayed} = this.props;
        const handlePageClick = (data) => updatePage(data.selected + 1);

        return (
            <ReactPaginate
                pageCount={pages}
                pageRangeDisplayed={this.props.pagesToDisplay}
                marginPagesDisplayed={marginPagesDisplayed}
                onPageChange={handlePageClick}
                forcePage={current - 1}

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
