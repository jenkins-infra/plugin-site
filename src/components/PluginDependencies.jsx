import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
const sortFunc = (a, b) => a.implied === b.implied ? (a.optional === b.optional ? 0 : a.optional ? 1 : -1 ) : (a.implied ? 1 : -1);

function PluginDependencies({dependencies} ) {
    const [isShowImplied, setShowImplied] = React.useState(false);
    const toggleShowImplied = (e) => {
        e && e.preventDefault();
        setShowImplied(!isShowImplied);
    };

    if (!dependencies || dependencies.length === 0) {
        return (<div className="empty">No dependencies found</div>);
    }

    return (
        <>
            <Modal placement="bottom" isOpen={isShowImplied} target="pluginDependancies" toggle={toggleShowImplied}>
                <ModalHeader toggle={toggleShowImplied}>About Implied Plugin Dependencies</ModalHeader >
                <ModalBody>
                    <div>
                        <p>
                            Features are sometimes detached (or split off) from Jenkins core and moved into a plugin.
                            Many plugins, like Subversion or JUnit, started as features of Jenkins core.
                        </p>
                        <p>
                            Plugins that depend on a Jenkins core version before such a plugin was detached from core may or may not actually use any of its features.
                            To ensure that plugins don&apos;t break whenever functionality they depend on is detached from Jenkins core, it is considered to have a dependency on the detached plugin if it declares a dependency on a version of Jenkins core before the split.
                            Since that dependency to the detached plugin is not explicitly specified, it is
                            {' '}
                            <em>implied</em>
                            .
                        </p>
                        <p>
                            Plugins that don&apos;t regularly update which Jenkins core version they depend on will accumulate implied dependencies over time.
                        </p>
                    </div>
                </ModalBody>
            </Modal>
            <div id="pluginDependancies">
                {
                    dependencies.sort(sortFunc).map((dependency) => {
                        const kind = !dependency.optional ? (dependency.implied ? 'implied' : 'required') : 'optional';
                        if (kind === 'implied') {
                            return (
                                <div key={dependency.name} className={kind}>
                                    <Link to={`/${dependency.name}/`}>
                                        {dependency.title}
                                        {' '}
                                        v.
                                        {dependency.version}
                                        {' '}
                                        <span className="req">
                                            (
                                            {kind}
                                            )
                                        </span>
                                    </Link>
                                    <a href="#" onClick={toggleShowImplied}><span className="req">(what&apos;s this?)</span></a>
                                </div>
                            );
                        }
                        return (
                            <div key={dependency.name} className={kind}>
                                <Link to={`/${dependency.name}/`}>
                                    {dependency.title}
                                    {' '}
                                    ≥
                                    {' '}
                                    {dependency.version}
                                    {' '}
                                    {kind === 'required' ? '' : <span className="req">
                                        (
                                        {kind}
                                        )
                                    </span>}
                                </Link>
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}

PluginDependencies.propTypes = {
    dependencies: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            version: PropTypes.string.isRequired,
            optional: PropTypes.bool,
            implied: PropTypes.bool
        })
    )
};

export default PluginDependencies;
