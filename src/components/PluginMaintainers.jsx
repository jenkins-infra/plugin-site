import React from 'react';
import PropTypes from 'prop-types';

function PluginMaintainers({maintainers}) {
    return (
        <>
            {maintainers.map((maintainer) => (
                <div className="maintainer" key={maintainer.id}>
                    {maintainer.name || maintainer.id}
                </div>
            ))}
        </>
    );
}

PluginMaintainers.propTypes = {
    maintainers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string,
        })
    ).isRequired
};
export default PluginMaintainers;
