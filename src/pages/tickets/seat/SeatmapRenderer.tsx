import React from 'react';
import styled from 'styled-components';
import { Ticket } from '@phoenixlan/phoenix.js';
import { useSeatableTickets } from '../../../hooks/api/useSeatableTickets';
import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { TicketSelector } from './TicketSelector';
import { useCurrentSeatmap } from '../../../hooks/api/useCurrentSeatmap';
import { InlineSpinner } from '../../../sharedComponents/LoadingSpinner';
import { Header2 } from '../../../sharedComponents/Header2';
import { useCurrentEvent } from '../../../hooks';
import { toast } from 'react-toastify';

interface SeatmapContainerProps {
    width: number;
    height: number;
    background: string | null;
}

const SeatingNotOpenOverlay = styled.div`
    background-color: rgba(255, 255, 255, 0.4);
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    position: absolute;
    padding: ${({ theme }) => theme.spacing.m};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SeatmapContainer = styled.div<SeatmapContainerProps>`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    background-image: url('${(props) => props.background ?? ''}');

    position: relative;
`;
const ContainerOuter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const NoSeatmap = styled.div`
    min-width: 30em;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

interface RowProps {
    x: number;
    y: number;
}

const Row = styled.div<RowProps>`
    position: absolute;
    width: 32px;
    left: ${(props) => props.x}px;
    top: ${(props) => props.y}px;
`;

interface SeatProps {
    color: string;
}

const Seat = styled.div<SeatProps>`
    box-sizing: content-box;
    cursor: pointer;
    width: 27px;
    height: 27px;

    padding: 2px;
    margin: 1px;

    font-size: 10px;

    text-align: center;
    font-family: arial;
    display: inline-block;

    background-color: ${(props) => props.color};
`;

interface SeatmapRendererProps {
    activeTicket: number | null;
    onSeatedTicket: (ticket_id: number) => void;
}

export const SeatmapRenderer: React.FC<SeatmapRendererProps> = ({ activeTicket, onSeatedTicket }) => {
    const { data: seatmap, isLoading: isLoadingSeatmap, refetch: refetchSeatmap } = useCurrentSeatmap();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();

    const onSeatSelected = async (seatUuid: string) => {
        if (activeTicket !== null) {
            try {
                await Ticket.seatTicket(activeTicket, seatUuid);
            } catch (e: unknown) {
                toast.error(JSON.stringify(e));
            }
            refetchSeatmap();
            onSeatedTicket(activeTicket);
        }
    };

    if (isLoadingSeatmap || isLoadingCurrentEvent) {
        return <InlineSpinner />;
    }

    if (!seatmap) {
        return (
            <NoSeatmap>
                <Header2>Ingen seatmap</Header2>
                <p>Vi har ikke sluppet seatmap enda. Vennligst vent!</p>
            </NoSeatmap>
        );
    }

    const seatingTime = (currentEvent?.booking_time ?? 0) + (currentEvent?.seating_time_delta ?? 0);

    return (
        <ContainerOuter>
            <SeatmapContainer width={seatmap.width} height={seatmap.height} background={seatmap.background_url}>
                {seatmap.rows.map((row) => (
                    <Row key={row.uuid} x={row.x} y={row.y}>
                        {row.seats.map((seat) => (
                            <Seat
                                key={seat.uuid}
                                onClick={() => onSeatSelected(seat.uuid)}
                                color={
                                    seat.ticket_id !== null && seat.ticket_id == activeTicket
                                        ? 'gray'
                                        : seat.taken
                                        ? 'red'
                                        : seat.is_reserved
                                        ? 'blue'
                                        : 'green'
                                }
                            >
                                <span>R{row.row_number}</span>
                                <br />
                                <span>S{seat.number}</span>
                            </Seat>
                        ))}
                    </Row>
                ))}
                {new Date().getTime() < seatingTime * 1000 ? (
                    <SeatingNotOpenOverlay>
                        <Header2>Seating har ikke åpent enda</Header2>
                        <p>Seating for dette arrangementet åpner {new Date(seatingTime * 1000).toLocaleString()}</p>
                    </SeatingNotOpenOverlay>
                ) : null}
            </SeatmapContainer>
        </ContainerOuter>
    );
};
