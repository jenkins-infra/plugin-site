import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';

function SuspendedPlugins({pluginIds}) {
    return (!!pluginIds.length && <div className="alert alert-info">
        <>One or more suspended plugins match your query: </>
        <>
            {pluginIds.map((name, index) => {
                return (<span key={name}>
                    {index > 0 ? ', ' : ''}
                    <Link to={`/${name}`}>{name}</Link>
                </span>);
            })}
        </>
    </div>);
}

SuspendedPlugins.propTypes = {
    pluginIds: PropTypes.arrayOf(PropTypes.string)
};

export default SuspendedPlugins;
