import React from 'react';
import copy from 'copy-to-clipboard';

// from https://reedbarger.com/how-to-create-a-custom-usecopytoclipboard-react-hook/
export default function useCopyToClipboard(resetInterval = null) {
    const [isCopied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback((text) => {
        if (typeof text === 'string' || typeof text == 'number') {
            copy(text.toString());
            setCopied(true);
        } else {
            setCopied(false);
            // eslint-disable-next-line no-console
            console.error(`Cannot copy typeof ${typeof text} to clipboard, must be a string or number.`);
        }
    }, []);

    React.useEffect(() => {
        let timeout;
        if (isCopied && resetInterval) {
            timeout = setTimeout(() => setCopied(false), resetInterval);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [isCopied, resetInterval]);

    return [isCopied, handleCopy];
}
