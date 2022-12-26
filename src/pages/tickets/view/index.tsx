/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { TicketCarousel } from './TicketCarousel';
import { PositiveButton } from '../../../sharedComponents/forms/Button';

import { useAuth } from '../../../authentication/useAuth';
import { useCurrentEvent } from '../../../hooks';
import { useOwnedTickets } from '../../../hooks/api/useOwnedTickets';
import { useTicketTransfers } from '../../../hooks/api/useTicketTransfers';

import { Ticket } from '@phoenixlan/phoenix.js';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { Header2 } from '../../../sharedComponents/Header2';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { TicketTransfer } from './TicketTransfer';

const BuyTicketPrompt = styled.div`
    text-align: center;
`;

const TutorialContainer = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
`;

const TicketTransferContainer = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`;

export const Tickets: React.FC = () => {
    const navigate = useNavigate();
    const { client } = useAuth();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ownedTickets } = useOwnedTickets();
    const { data: ticketTransfers } = useTicketTransfers();

    const buyTickets = () => {
        navigate('/buy');
    };

    const currentTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event_uuid === (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);
    const oldTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event_uuid !== (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);

    const currentTicketsSeatable = currentTickets.filter((ticket) => ticket.ticket_type.seatable);
    const currentTicketsNotSeatable = currentTickets.filter((ticket) => !ticket.ticket_type.seatable);

    return (
        <Skeleton loading={isLoadingCurrentEvent}>
            <CenterBox centerVertically={false}>
                {(ticketTransfers ?? []).length > 0 ? (
                    <>
                        <Header1>Billett-overføringer</Header1>
                        <TicketTransferContainer>
                            {(ticketTransfers ?? []).map((transfer) => (
                                <TicketTransfer key={transfer.uuid} transfer={transfer} />
                            ))}
                        </TicketTransferContainer>
                    </>
                ) : null}
                <Header1>Billetter til {currentEvent?.name ?? '(laster)'}</Header1>
                <TicketCarousel tickets={currentTicketsSeatable} />
                {currentTicketsSeatable.length === 0 ? (
                    <BuyTicketPrompt>
                        <p>Du har ingen billetter.</p>
                        <PositiveButton onClick={buyTickets}>Kjøp billetter</PositiveButton>
                    </BuyTicketPrompt>
                ) : null}
                {currentTicketsNotSeatable.length > 0 ? (
                    <>
                        <Header1>Andre ting for {currentEvent?.name ?? '(laster)'}</Header1>
                        <TicketCarousel used={true} tickets={currentTicketsNotSeatable} />
                    </>
                ) : null}
                {oldTickets.length > 0 ? (
                    <>
                        <Header1>Tidligere kjøp</Header1>
                        <TicketCarousel used={true} tickets={oldTickets} />
                    </>
                ) : null}
                <TutorialContainer>
                    <Header2>Hvordan fungerer overførte billetter?</Header2>
                    <p>
                        Du kan overføre billetter du har kjøpt til andre. Dette gjør du ved å trykke på billetten, velge
                        &quot;overfør billett&quot;, og skrive inn e-post addressen til mottakeren.
                    </p>
                    <p>
                        Du vil få 24 timer på å angre overføringen, skulle du ha sent billetten til feil person.
                        Mottakeren er også informert om at overføringen kan angres i 24 timer. Alle overføringer er
                        loggført, og mottakeren vil bli informert dersom overføringen blir angret.
                    </p>
                </TutorialContainer>
                <TutorialContainer>
                    <Header2>Hva er en seater? Hva gjør vi om vi er en gruppe?</Header2>
                    <p>
                        Du kan gi en annen person rettigheter til å plassere billetten din for deg, slik at en person
                        kan seate vennegjengen deres samlet. Trykk på en billett for å gjøre dette.
                    </p>
                    <p>Dere kan også kjøpe billettene samlet og overføre til riktig eier senere.</p>
                    <p>
                        <b>
                            Billetten MÅ være overført til riktig bruker innen LANet starter - ellers slipper du ikke
                            inn!
                        </b>
                    </p>
                </TutorialContainer>
            </CenterBox>
        </Skeleton>
    );
};
