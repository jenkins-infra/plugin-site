import React from 'react';
import PropTypes from 'prop-types';
import {cleanTitle} from '../commons/helper';

const COLORS = ['#6D6B6D', '#DCD9D8', '#D33833', '#335061', '#81B0C4', '#709aaa', '#000'];

function Icon({title}) {
    title = cleanTitle(title);
    // pick color based on chars in the name to make semi-random, but fixed color per-plugin
    const color = COLORS[(title.length % 7)];
    const firstLetter = title.substring(0, 1).toUpperCase();
    const firstSpace = title.indexOf(' ') + 1;
    const nextIndex = firstSpace === 0 ? 1 : firstSpace;
    const nextLetter = title.substring(nextIndex, nextIndex + 1);
    return (
        <i className="i" style={{background: color}}>
            <span className="first">{firstLetter}</span>
            <span className="next">{nextLetter}</span>
        </i>
    );
}

Icon.propTypes = {
    title: PropTypes.any.isRequired
};

export default Icon;
