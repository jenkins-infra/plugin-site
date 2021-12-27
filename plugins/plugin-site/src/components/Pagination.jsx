import React from 'react';
import PropTypes from 'prop-types';
import Pages from './Pages';


function Pagination({limit, page, pages, total, setPage}) {
    if (total == 0) {
        return null;
    }

    const start = (limit * (page - 1));
    const end = Math.min(limit * (page), total);

    return (
        <>
            <div className="row nav-link">
                {`${start+1} to ${end} of ${total}`}
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
