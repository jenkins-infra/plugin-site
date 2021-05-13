import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {cleanTitle} from '../commons/helper';


export default function PluginLink({title = '', name = ''}) {
    return (
        <div className={'Entry-box'}>
            <Link key={name} to={`/${name}/`} className="titleOnly">
                {cleanTitle(title)}
            </Link>
        </div>
    );

}

PluginLink.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};
