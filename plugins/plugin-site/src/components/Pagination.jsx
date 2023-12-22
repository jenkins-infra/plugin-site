import React from 'react';
import PropTypes from 'prop-types';
import Pages from './Pages';


function Pagination({page, pages, setPage}) {
    const [pagesToDisplay, setPagesToDisplay] = React.useState(5);
    const [marginPagesDisplayed, setMarginPagesDisplayed] = React.useState(2);


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
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired
};

export default Pagination;
