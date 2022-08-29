import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';

function PluginDevelopers({developers}) {
    return (
        <>
            {developers.map((developer) => (
                <div className="maintainer" key={developer.id}>
                    <Link to={`/ui/search?query=${developer.id}`}>{developer.name || developer.id}</Link>
                </div>
            ))}
        </>
    );
}

PluginDevelopers.propTypes = {
    developers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string,
        })
    ).isRequired
};
export default PluginDevelopers;
