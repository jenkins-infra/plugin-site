import React from 'react';

export default function Spinner() {
    return (
        <div id="plugin-spinner" className="spinner double-bounce2">
            <i className="icon-jenkins" />
            <div className="swing">
                <div className="swing-l" />
                <div />
                <div />
                <div className="swing-r" />
            </div>
            <div>...working...</div>
        </div>
    );
}
