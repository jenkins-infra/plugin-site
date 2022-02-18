import React from 'react';
import {Link} from 'gatsby';
import Layout from '../layout';
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';

const title = 'Plugin page not found';
const notFoundPage = 'pages/404.jsx';

const NotFound = ({location}) => (
    <Layout reportProblemRelativeSourcePath={notFoundPage} reportProblemUrl="" reportProblemTitle={title}>
        <Helmet><title>{title}</title></Helmet>
        <div className="not-found-box">
            <div className="not-found">
                <i className="icon-plug" />
                <i className="icon-ban" />
                <h3>{title}</h3>
                <p>
                    We are sorry but the page you are looking for does not exist.
                    <br />
                    <Link to={`/ui/search?query=${location.href.substring(location.href.lastIndexOf('/') + 1, location.href.length)}`} >Search again</Link>
                    ?
                </p>
            </div>
        </div>
    </Layout>
);

NotFound.propTypes = {
    location: PropTypes.any,
};
export default NotFound;
