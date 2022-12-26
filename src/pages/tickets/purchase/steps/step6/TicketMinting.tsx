/*
 * @created 01/06/2021 - 10:43
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useEffect, useState } from 'react';
import { poll } from '@phoenixlan/phoenix.js';
import { LoadingSpinner } from '../../../../../sharedComponents/LoadingSpinner';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Spinner = styled.div`
    position: relative;
    margin-top: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const StatusText = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing.m};
`;

interface Props {
    uuid: string;
}

enum Status {
    normal,
    long,
    failure,
    success,
}

enum ServerStatus {
    None = '',
    Created = 'PaymentState.created',
    Paid = 'PaymentState.paid',
    Failed = 'PaymentState.failed',
    TicketsMinted = 'PaymentState.tickets_minted',
}

export const TicketMinting: React.FC<Props> = ({ uuid }) => {
    const navigate = useNavigate();

    const POLLING_INTERVAL = 5;
    const NORMAL_WAIT_TIME_SECONDS = 60;
    const FAILURE_WAIT_TIME_SECONDS = 300;

    const [status, setStatus] = useState(Status.normal);
    const [serverStatus, setServerStatus] = useState(ServerStatus.None);
    const [poolIntervalId, setPoolIntervalId] = useState<number>();

    useEffect(() => {
        if (status === Status.success) {
            const timoutId = setTimeout(() => {
                navigate('/');
            }, 5000);

            return () => clearTimeout(timoutId);
        }
    }, [status]);

    const pollHandler = (func: () => void) => {
        let count = 1;

        const handler = {
            /* eslint-disable-next-line @typescript-eslint/ban-types */
            apply(func: Function, scope: any, c: any[]) {
                if (count * POLLING_INTERVAL > FAILURE_WAIT_TIME_SECONDS) {
                    setStatus(Status.failure);
                    clearInterval(poolIntervalId);
                } else if (count * POLLING_INTERVAL > NORMAL_WAIT_TIME_SECONDS) {
                    setStatus(Status.long);
                }
                count++;
                return Reflect.apply(func, scope, c);
            },
        };

        return new Proxy(func, handler);
    };

    const polling = async () => {
        const paymentInfo = await poll(uuid);
        const paymentState = paymentInfo.state;
        switch (paymentState) {
            case ServerStatus.Created:
                setServerStatus(ServerStatus.Created);
                break;
            case ServerStatus.Paid:
                if (serverStatus === ServerStatus.Paid) {
                    setStatus(Status.failure);
                    clearInterval(poolIntervalId);
                }
                setServerStatus(ServerStatus.Paid);
                break;
            case ServerStatus.TicketsMinted:
                setServerStatus(ServerStatus.TicketsMinted);
                setStatus(Status.success);
                clearInterval(poolIntervalId);
                break;
            case ServerStatus.Failed:
                setServerStatus(ServerStatus.Failed);
                clearInterval(poolIntervalId);
                break;
        }
    };

    useEffect(() => {
        const intervalId = setInterval(pollHandler(polling), POLLING_INTERVAL * 1000);
        setPoolIntervalId(intervalId);

        return () => clearInterval(intervalId);
    }, []);

    const getStatusText = (status: Status) => {
        switch (status) {
            case Status.normal:
                return 'Vennligst vent mens vi behandler betalingen';
            case Status.long:
                return 'Det tar mer tid enn vanlig å gjennomføre betalingen - vi venter på tilbakemelding fra betalingstilbyder om at betalingen er gjennomført';
            case Status.failure:
                return 'Vi har enda ikke fått en oppdatering fra betalingstilbyderen våres - noe kan være galt på vår side. Kontakt info@phoenixlan.no, så ordner vi det';
            case Status.success:
                return 'Betalingen er gjennomført og kvittering er sendt til mailen din, vennligst sjekk mailen din. Du blir videresent til dine billetter om 5 sekunder...';
        }
    };

    return (
        <Container>
            {status !== Status.success && (
                <Spinner>
                    <LoadingSpinner />
                </Spinner>
            )}
            <StatusText>{getStatusText(status)}</StatusText>
        </Container>
    );
};
