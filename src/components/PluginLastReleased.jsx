import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import {formatter} from '../commons/helper';

const getTime = (releaseTimestamp, buildDate) => {
    if (releaseTimestamp) {
        // 2017-02-09T15:19:10.00Z
        return moment.utc(releaseTimestamp);
    }
    // 2017-02-09
    return moment.utc(buildDate, ['MMM DD, YYYY', 'YYYY-MM-DD'], true);
};

function PluginLastReleased({releaseTimestamp, buildDate}) {
    const time = getTime(releaseTimestamp, buildDate);
    return (
        <div>
            {'Released: '}
            <TimeAgo date={time} formatter={formatter}/>
        </div>
    );
}

PluginLastReleased.propTypes = {
    releaseTimestamp: PropTypes.string,
    buildDate: PropTypes.string
};
PluginLastReleased.displayName = 'PluginLastReleased';

export default PluginLastReleased;
