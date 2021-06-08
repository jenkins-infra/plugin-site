import React from 'react';
import PropTypes from 'prop-types';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import src from '../images/clipboard.svg';
import {copyWrapper, copySuccess} from './ClipboardButton.module.css';
import classNames from 'classnames';

function ClipboardButton({content}) {
    const [isCopied, handleCopy] = useCopyToClipboard(3000);
    return (<div className={copyWrapper}>
        {isCopied && (<div className={classNames('alert', 'alert-success', copySuccess)}>{'Copied to clipboard'}</div>)}
        <button className="btn" onClick={()=>handleCopy(content)} aria-label="Copy to clipboard">
            <img src={src} alt=""/>
        </button>
    </div>);
}

ClipboardButton.propTypes = {
    content: PropTypes.string.isRequired
};

export default ClipboardButton;
