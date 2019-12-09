import PropTypes from 'prop-types';
import React from 'react';

function Label({toggleLabel, category, activeLabels, label}) {

    const handleOnChange = () => toggleLabel(label, category);
    const checked = activeLabels.find((active) => active === label.id) !== undefined;
    return (
        <li key={label.id}>
            <label>
                <input type="checkbox" name="labels" value={label.id} checked={checked} onChange={handleOnChange} />
                <span>{label.title}</span>
            </label>
        </li>
    );
}
Label.propTypes = {
    activeLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.shape({
    }).isRequired,
    label: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string
    }).isRequired,
    toggleLabel: PropTypes.func.isRequired
};


export default Label;
