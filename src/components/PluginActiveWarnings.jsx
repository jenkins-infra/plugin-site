import React from 'react';
import PropTypes from 'prop-types';
import PluginReadableVersion from './PluginReadableVersion';
import {Modal, ModalHeader, ModalBody} from 'reactstrap';

function PluginActiveWarnings({securityWarnings}) {
    const [showDialog, setShowDialog] = React.useState(false);
    const toggleShowDialog = (e) => {
        e && e.preventDefault();
        setShowDialog(!showDialog);
    };

    if (!securityWarnings) {
        return null;
    }
    const active = securityWarnings.filter(warning => warning.active);
    if (active.length == 0) {
        return null;
    }
    return (
        <div className="badge-box">
            <span className="badge active warning" onClick={toggleShowDialog} />
            <Modal isOpen={showDialog} toggle={toggleShowDialog}>
                <ModalHeader toggle={toggleShowDialog}>Active Security Warnings</ModalHeader >
                <ModalBody>
                    <div>
                        <ul>
                            {active.map(warning => {
                                return (
                                    <li key={warning.url}>
                                        <h3><a href={warning.url}>{warning.message}</a></h3>
                                        <ul>
                                            {warning.versions.map((version, idx) => (
                                                <li key={idx}>
                                                    <PluginReadableVersion version={version} active={false} />
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
  
PluginActiveWarnings.propTypes = {
    securityWarnings: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool.isRequired,
            url: PropTypes.string,
            message: PropTypes.string,
            versions: PropTypes.array,
        })
    )
};

export default PluginActiveWarnings;
