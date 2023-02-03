import React from 'react';
import PropTypes from 'prop-types';
import Pages from './Pages';


function Pagination({limit, page, pages, total, setPage}) {
    const [pagesToDisplay, setPagesToDisplay] = React.useState(5);

    if (total == 0) {
        return null;
    }

    const start = (limit * (page - 1));
    const end = Math.min(limit * (page), total);

    React.useEffect(() => {
        if (window.innerWidth < 768) {
            setPagesToDisplay(2);
        }

        const handleWindowResize = () => {
            if (window.innerWidth < 768) {
                setPagesToDisplay(2);
            } else {
                setPagesToDisplay(5);
            }
        };

        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    return (
        <>
            <div className="nav-link">
                {`${start+1} to ${end} of ${total}`}
            </div>
            {pages > 1 &&
                <Pages
                    current={page}
                    pages={pages}
                    pagesToDisplay={pagesToDisplay}
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
