import React from 'react';
import PropTypes from 'prop-types';
import Pages from './Pages';


function Pagination({limit, page, pages, total, setPage}) {
    const start = (limit * page) - (limit - 1);
    const end = limit * page <= total ? limit * page : total;
    if (total == 0) {
        return null;
    }

    return (
        <>
            <div className="row nav-link">
                {`${start} to ${end} of ${total}`}
            </div>
            {pages > 1 &&
                <Pages
                    current={page}
                    pages={pages}
                    pagesToDisplay={5}
                    updatePage={setPage}
                />
            }
        </>
    );
}

Pagination.propTypes = {
    limit: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired
};

export default Pagination;
