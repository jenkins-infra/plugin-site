import React from 'react';
import PropTypes from 'prop-types';
import Pages from './Pages';


function Pagination({limit, page, pages, total, setPage}) {
    const start = (limit * page) - (limit - 1);
    const end = limit * page <= total ? limit * page : total;
    return (
        <li className="nav-item page-picker">
            {total > 0 &&
                <span className="nav-link">
                    {`${start} to&nbsp${end} of ${total}`}
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

Pagination.propTypes = {
    limit: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired
};

export default Pagination;
