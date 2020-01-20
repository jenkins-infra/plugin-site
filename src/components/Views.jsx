import React from 'react';
import PropTypes from 'prop-types';
import View from './View';

const views = ['Tiles', 'List', 'Table'];

function Views({view, setView}) {
    return (
        <fieldset>
            { views.map((singleView, index) => {
                return (
                    <View
                        key={index}
                        isActive={singleView === view}
                        updateView={setView}
                        view={singleView}
                    />
                );
            })}
        </fieldset>
    );
}
    
Views.propTypes = {
    setView: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired
};

export default Views;
