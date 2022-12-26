/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { HandIndexFill } from '@styled-icons/bootstrap/HandIndexFill';
import { Ticket as PhoenixTicket } from '@phoenixlan/phoenix.js';
import { QRCodeSVG } from 'qrcode.react';

import { SeatRow, Seat, Row, SubTitle, Title, Corner } from './ticketConponents';

const Container = styled.div`
    cursor: pointer;
    user-select: none;
`;

const Inner = styled.div<{ enlarge: boolean }>`
    width: 100%;
    height: 100%;
    border: 1px solid gray;
    border-radius: 0.5rem;
    padding: ${({ theme }) => theme.spacing.s};
    padding-bottom: ${({ theme }) => theme.spacing.m};

    display: flex;
    align-items: center;
    justify-content: center;
`;

const InnerTop = styled(Inner)`
    border-bottom: 1px dashed gray;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: ${({ theme, enlarge }) => (enlarge ? theme.fontSize.m : theme.fontSize.s)};
`;

const InnerBottom = styled(Inner)`
    border-top: 1px dashed gray;
`;

const Top = styled.div<{ enlarge: boolean }>`
    height: ${({ enlarge }) => (enlarge ? '300px' : '200px')};
    width: ${({ enlarge }) => (enlarge ? '225px' : '150px')};
    position: relative;
    overflow: hidden;
`;

const Bottom = styled.div<{ enlarge: boolean }>`
    height: ${({ enlarge }) => (enlarge ? '150px' : '100px')};
    width: ${({ enlarge }) => (enlarge ? '225px' : '150px')};
    position: relative;
    overflow: hidden;
`;

const ripple = (color: string) => keyframes`
    0% {
        box-shadow: 0 0 0 0 ${color},
                    0 0 0 0.4em ${color},
                    0 0 0 0.8em ${color},
                    0 0 0 1.2em ${color};
    }
    100% {
        box-shadow: 0 0 0 0.4em ${color},
                    0 0 0 0.8em ${color},
                    0 0 0 1.2em ${color},
                    0 0 0 1.8em #ffffffff;
    }
`;

const Tap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0em;
    height: 0em;
    border-radius: 50%;
    animation: ${({ theme }) => ripple(theme.colors.primary)} 1.5s linear infinite;
`;

const TapIcon = styled(HandIndexFill)`
    min-width: 1em;
    color: slategray;
`;

interface Props {
    ticket: PhoenixTicket.FullTicket;
    showQr?: boolean;
    onClick?: () => void;
    enlarge?: boolean;
}

export const Ticket: React.FC<Props> = ({ ticket, showQr = false, onClick, enlarge = false }) => {
    const qr = `PHOENIX_TICKET_${ticket.ticket_id}`;

    return (
        <Container onClick={onClick}>
            <Top enlarge={enlarge}>
                <Corner left={true} top={false} />
                <Corner left={false} top={false} />
                <InnerTop enlarge={enlarge}>
                    <Row>
                        <Title enlarge={enlarge}>Phoenix Lan</Title>
                    </Row>
                    <Row>
                        <SubTitle>{ticket.ticket_type.seatable ? 'Billett-ID' : 'Kjøp-ID'}</SubTitle>
                        <span>#{ticket.ticket_id}</span>
                    </Row>
                    <Row>
                        <SubTitle>Type</SubTitle>
                        <span>{ticket.ticket_type.name}</span>
                    </Row>
                    {ticket.seat ? (
                        <>
                            <Row>
                                <SubTitle>Seater</SubTitle>
                                <span>
                                    {ticket.seater ? `${ticket.seater.firstname} ${ticket.seater.lastname}` : 'Deg'}
                                </span>
                            </Row>
                            <Seat>
                                <SeatRow>
                                    <SubTitle>Rad</SubTitle>
                                    <span>{ticket.seat.row.row_number}</span>
                                </SeatRow>
                                <SeatRow>
                                    <SubTitle>Sete</SubTitle>
                                    <span>{ticket.seat.number}</span>
                                </SeatRow>
                            </Seat>
                        </>
                    ) : ticket.ticket_type.seatable ? (
                        <span>
                            <b>Ikke seatet</b>
                        </span>
                    ) : (
                        <span>Ikke sittebillett</span>
                    )}
                </InnerTop>
            </Top>
            <Bottom enlarge={enlarge}>
                <Corner left={true} top={true} />
                <Corner left={false} top={true} />
                <InnerBottom enlarge={enlarge}>
                    {showQr ? <QRCodeSVG value={qr} size={enlarge ? 90 : 60} /> : <Tap>QR</Tap>}
                </InnerBottom>
            </Bottom>
        </Container>
    );
};
