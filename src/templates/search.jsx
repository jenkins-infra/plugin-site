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
    const [showFilter, setShowFilter] = React.useState(false);
    const [page, setPage] = React.useState(1);


    return (
        <Layout id="searchpage">
            <SEO pathname={'/ui/search'} />
            <div className="row">
                <div className={'col-md-3'} />

                <div className={'col-md-6'}>
                    <SearchBox showFilter={showFilter} setShowFilter={setShowFilter} /> 
                </div>

                <div className={'col-md-3'}>
                    <Views view={view} setView={setView} />
                </div>
            </div>
            <div className="row">
                <div className={'col-md-3'}>
                    <Filters showFilter showResults />
                </div>

                <div className="col-md-9">
                    <SearchResults showFilter={false} showResults page={page} setPage={setPage} />
                </div>
            </div>
            <Footer />
        </Layout>
    );
}

SearchPage.propTypes = {   
};

export default SearchPage;
