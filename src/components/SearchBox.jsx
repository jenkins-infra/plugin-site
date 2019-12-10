import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/main.module.css';
import classNames from 'classnames';

// handleOnChange = (event) => {
//     event.preventDefault();
//     this.props.setQuery(event.currentTarget.value);
// }

// // For some reason the input.onFocus was overriding a.onClick so use the
// // same function and detect the caller
// handleToggleShowFilter = (event) => {
//     event.preventDefault();
//     const forceOpen = event.currentTarget.name === 'query';
//     this.props.toggleShowFilter({forceOpen: forceOpen});
// }

function SearchBox({handleOnSubmit, showFilter, setShowFilter}) {
    const [query, setQuery] = React.useState('');

    const handleToggleShowFilter = (e) => {
        e && e.preventDefault();
        setShowFilter(!showFilter);
    };
    
    return (
        <fieldset className={classNames(styles.SearchBox, 'form-inline SearchBox')}>
            <div className={classNames(styles.searchBox, 'form-group')}>
                <label className={classNames(styles.searchLabel, 'input-group')}>
                    <div className={classNames('input-group-prepend')}>
                        <a className={classNames(styles.ShowFilter, styles.Fish, 'btn btn-primary ShowFilter')}
                            onClick={handleToggleShowFilter}>
                            {'Browse '}
                            <span>{showFilter ? '▼' : '◄' }</span>
                        </a>
                        <input name="query"
                            value={query}
                            autoFocus
                            onChange={setQuery}
                            onClick={handleToggleShowFilter}
                            className={classNames('form-control')}
                            placeholder="Find plugins..."
                        />
                        <input type="submit" className="sr-only" />
                        <div className={classNames('input-group-append')}>
                            <div className={classNames(styles.SearchBtn, 'SearchBtn btn btn-primary')}
                                onClick={handleOnSubmit}>
                                <i className={classNames('icon-search')} />
                            </div>
                        </div>
                    </div>
                </label>
            </div>
        </fieldset>
    );
}

SearchBox.propTypes = {
    handleOnSubmit: PropTypes.func.isRequired,
    setShowFilter: PropTypes.func.isRequired,
    showFilter: PropTypes.bool.isRequired
};

SearchBox.defaultProps = {
    handleOnSubmit: () => {}
};

export default SearchBox;
