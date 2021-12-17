import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import {formatter} from '../commons/helper';

function PluginLastReleased({releaseTimestamp, buildDate}) {
    return (
        <div>
            {'Released: '}
            <TimeAgo date={Date.parse(releaseTimestamp || buildDate)} formatter={formatter}/>
        </div>
    );
}

PluginLastReleased.propTypes = {
    releaseTimestamp: PropTypes.string,
    buildDate: PropTypes.string
};
PluginLastReleased.displayName = 'PluginLastReleased';

export default PluginLastReleased;
