import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import {formatter} from '../commons/helper';

const getTime = (plugin) => {
    if (plugin.releaseTimestamp !== null) {
    // 2017-02-09T15:19:10.00Z
        return moment.utc(plugin.releaseTimestamp);
    } else {
    // 2017-02-09
        return moment.utc(plugin.buildDate, 'YYYY-MM-DD');
    }
};
  
function PluginLastReleased({plugin}) {
    const time = getTime(plugin);
    return (
        <span className="col-md-3">
            {'Released: '}
            <TimeAgo date={time} formatter={formatter}/>
        </span>
    );
}
  
PluginLastReleased.propTypes = {
    plugin: PropTypes.shape({
        releaseTimestamp: PropTypes.string,
        buildDate: PropTypes.string
    })
};

export default PluginLastReleased;
