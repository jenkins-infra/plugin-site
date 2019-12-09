import React from 'react';
import {Link} from 'gatsby';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';
import {css} from '@emotion/core';

const ModalView = styled.section`
`;

const DialogContainer = styled.div`
    padding-top: 0px !important;
`;

const Header = css`
    padding: 15px 15px 15px 25px;
    background-color: rgb(22, 139, 185);
    color: rgb(255, 255, 255);
    font-size: 18px;
    font-weight: normal;
    overflow-y: auto;
    max-height: 20%;
    min-height: 5%;

    a, a:visited {
        color: rgb(255, 255, 255);
    }

    .back:before {
        content: '\u2B05';
        margin-right:.5rem;
    }
`;

const Content = styled.div`
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    overflow-y: auto;
    max-height: 90%;
    min-height: 75%;
    padding: 25px 20px 25px 50px;
`;

function Dialog({children, title}) {
    return (
        <ModalView className="modalview">
            <DialogContainer className="dialog">
                <div className="header" css={Header}>
                    <Link to="/">
                        <div className="back">{title}</div>
                    </Link>
                </div>
                <Content className="content">{children}</Content>
            </DialogContainer>
        </ModalView>
    );
}


Dialog.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default Dialog;
