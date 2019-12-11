// import {graphql} from 'gatsby';
import React from 'react';
// import PropTypes from 'prop-types';

import Layout from '../layout';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Views from '../components/Views';
import SearchResults from '../components/SearchResults';
import SearchBox from '../components/SearchBox';
import Filters from '../components/Filters';

function SearchPage() {
    const [view, setView] = React.useState('Tiles');
    const [showFilter, setShowFilter] = React.useState(true);
    const [page, setPage] = React.useState(1);

    return (
        <Layout id="searchpage">
            <SEO pathname={'/ui/search'} />
            <div className="row">
                {showFilter && (<div className={'col-md-3'}>
                    <Filters showFilter={showFilter} showResults />
                </div>)}
                <div className={showFilter ? 'col-md-9' : 'offset-md-1 col-md-11'}>
                    <div className="row">
                        <div className={'col-md-9'}>
                            <SearchBox showFilter={showFilter} setShowFilter={setShowFilter} /> 
                        </div>
                        <div className={'col-md-3'}>
                            <Views view={view} setView={setView} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <SearchResults showFilter={showFilter} showResults page={page} setPage={setPage} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Layout>
    );
}

SearchPage.propTypes = {   
};

export default SearchPage;
