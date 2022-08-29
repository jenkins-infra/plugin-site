import React from 'react';
import PropTypes from 'prop-types';

function PluginDevelopers({developers}) {
    return (
        <>
            {developers.map((developer) => (
                <div className="maintainer" key={developer.id}>
                    <a href={`/ui/search?query=${developer.id}`}>{developer.name || developer.id}</a>
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
