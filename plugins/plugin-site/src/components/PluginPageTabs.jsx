import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'gatsby';

const PluginPageTabs = ({tabs}) => {
    return (
        <ul className="nav nav-pills">
            {tabs.map(tab => {
                return (
                    <li className="nav-item" key={tab.id}>
                        <Link activeClassName="active" className="nav-link" to={tab.to}>{tab.label}</Link>
                    </li>
                );
            })}
        </ul>
    );
};
PluginPageTabs.displayName = 'PluginPageTabs';
PluginPageTabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    selectedTab: PropTypes.string.isRequired
};

export default PluginPageTabs;
