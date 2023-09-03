import React from 'react';
import PropTypes from 'prop-types';
import Pages from './Pages';


function Pagination({limit, page, pages, total, setPage}) {
    const [pagesToDisplay, setPagesToDisplay] = React.useState(5);
    const [marginPagesDisplayed, setMarginPagesDisplayed] = React.useState(2);

    const start = (limit * (page - 1));
    const end = Math.min(limit * (page), total);

    React.useEffect(() => {
        if (window.innerWidth < 576) {
            setPagesToDisplay(1);
            setMarginPagesDisplayed(1);
        }

        const handleWindowResize = () => {
            if (window.innerWidth < 576) {
                setPagesToDisplay(1);
                setMarginPagesDisplayed(1);
            } else {
                setPagesToDisplay(5);
                setMarginPagesDisplayed(2);
            }
        };

        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    return (
        <div className="Pagination--Container">
            <div className="nav-link">
                {`${start+1} to ${end} of ${total}`}
            </div>
            {pages > 1 &&
                <Pages
                    current={page}
                    pages={pages}
                    pagesToDisplay={pagesToDisplay}
                    updatePage={setPage}
                    marginPagesDisplayed={marginPagesDisplayed}
                />
            }
        </div>
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
