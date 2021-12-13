import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    InputGroup,
    InputGroupAddon,
    Input,
    Button
} from 'reactstrap';
import './SearchBox.css';


function SearchBox({handleOnSubmit, showFilter, setShowFilter, query, setQuery}) {
    const handleToggleShowFilter = (e) => {
        e && e.preventDefault();
        setShowFilter(!showFilter);
    };
    
    return (
        <fieldset className="SearchBox--Container">
            <div className="form-group">
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        {setShowFilter && <Button color="primary" onClick={handleToggleShowFilter}>
                            {'Browse '}
                            <span>{showFilter ? '▼' : '◄' }</span>
                        </Button>}
                        {!setShowFilter && <Button onClick={handleOnSubmit} color="primary">Browse</Button>}
                    </InputGroupAddon>
                    <Input
                        name="query"
                        value={query}
                        autoFocus
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleOnSubmit(e);
                            }
                        }}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find plugins..."
                    />
                    <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={handleOnSubmit}>
                            <i className={classNames('icon-search')} />
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </fieldset>
    );
}

SearchBox.propTypes = {
    handleOnSubmit: PropTypes.func.isRequired,
    setShowFilter: PropTypes.func,
    showFilter: PropTypes.bool,
    setQuery: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired
};

SearchBox.defaultProps = {
};

export default SearchBox;
