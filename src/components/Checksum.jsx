import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './Checksum.module.css';

function base64ToHex(str) {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : `0${ hex}`);
    }
    return result.toUpperCase();
}

function Checksum({type, value}) {
    if (!value) {
        return null;
    }
    return (
        <div className={styles.checksum}>
            <span>
                {type}
                :
            </span>
            {' '}
            <code>
                { base64ToHex(value) }
            </code>
        </div>
    );
}

Checksum.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string
};

export default Checksum;
