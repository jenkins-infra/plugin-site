import React from 'react';
import PropTypes from 'prop-types';
import {navigate} from 'gatsby';
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
import InstallViaCLI from './InstallViaCLI';

function InstallInstructions({isShowInstructions, toggleShowInstructions, pluginId, pluginVersion}) {
    return (
        <Modal placement="bottom" className="wide" isOpen={isShowInstructions} target="pluginDependencies" toggle={toggleShowInstructions}>
            <ModalHeader toggle={toggleShowInstructions}>Installation options</ModalHeader >
            <ModalBody>
                <ol>
                    <li>
                        <a href="https://www.jenkins.io/doc/book/managing/plugins/#from-the-web-ui">Using the GUI:</a>
                        {' From your Jenkins dashboard navigate to '}
                        <strong>Manage Jenkins &gt; Manage Plugins</strong>
                        {' and select the '}
                        <strong>Available</strong>
                        {' tab. Locate this plugin by searching for '}
                        <em>{pluginId}</em>
                        {'.'}
                    </li>
                    <li><InstallViaCLI pluginId={pluginId} version={pluginVersion} /></li>
                    <li>
                        <a href="https://www.jenkins.io/doc/book/managing/plugins/#advanced-installation">
                            {'Using direct upload'}
                        </a>
                        {'. Download one of the '}
                        <a href="#releases" onClick={e=>{toggleShowInstructions(e);navigate(`/${pluginId}/releases/`);}}>
                            {'releases'}
                        </a>
                        {' and upload it to your Jenkins controller.'}
                    </li>
                </ol>
            </ModalBody>
        </Modal>
    );
}

InstallInstructions.propTypes = {
    pluginId: PropTypes.string.isRequired,
    isShowInstructions: PropTypes.bool,
    toggleShowInstructions: PropTypes.func,
    pluginVersion: PropTypes.string
};

export default InstallInstructions;
