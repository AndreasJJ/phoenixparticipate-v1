/*
 * @created 01/04/2021 - 20:16
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { TypeRow } from './TypeRow';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { TicketType, User } from '@phoenixlan/phoenix.js';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';
import { ChosenTicketType } from '../../utils/types';
import { ErrorMessage } from '../../../../../sharedComponents/forms/ErrorMessage';
import { useCurrentEvent } from '../../../../../hooks/api/useCurrentEvent';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { useAuth } from '../../../../../authentication/useAuth';
import { ShadowBox } from '../../../../../sharedComponents/boxes/ShadowBox';
import { RadarEventInfo } from '../../../RadarEventInfo';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

interface Props {
    ticketTypes: Array<TicketType.TicketType>;
    onSubmit: (chosenTickets: ChosenTicketType) => void;
}

export const TicketsForm: React.FC<Props> = ({ ticketTypes, onSubmit }) => {
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const [canBypassTicketSaleRestriction, setCanBypassTicketSaleRestriction] = useState(false);
    const auth = useAuth();
    // Decode and extract the JWT token so we can see if the user has special permissions
    useEffect(() => {
        const inner = async () => {
            const token = (await Promise.resolve(
                auth.client.parsedToken ? auth.client.parsedToken() : { placeholder: true },
            )) as User.Oauth.JWTPayload;
            if (token.roles.indexOf('ticket_bypass_ticketsale_start_restriction') !== -1) {
                setCanBypassTicketSaleRestriction(true);
            }
        };
        inner();
    }, []);

    const bookingTime = currentEvent?.booking_time ?? 0;

    type validationSchemaType = { [index: string]: yup.AnySchema };
    const validationSchemaObject: validationSchemaType = {};
    for (const ticketType of ticketTypes) {
        validationSchemaObject[ticketType.uuid] = yup
            .number()
            .min(0, 'placeholder')
            .required('placeholder')
            .test('min', 'Du må velge minst en billett', function () {
                let sum = 0;
                for (const val of Object.values(this.parent)) {
                    sum += val as number;
                }
                return 0 <= sum;
            })
            .test('max', 'Du kan maks velge 10 billetter til sammen', function () {
                let sum = 0;
                for (const val of Object.values(this.parent)) {
                    sum += val as number;
                }
                return 10 >= sum;
            });
    }
    const validationSchema = yup.object().shape(validationSchemaObject);

    const defaultValues: ChosenTicketType = {};
    for (const ticketType of ticketTypes) {
        defaultValues[ticketType.uuid] = 0;
    }

    const formMethods = useForm(
        /*<FormData>*/ {
            resolver: yupResolver(validationSchema),
            defaultValues: defaultValues,
        },
    );

    const handleSubmit = formMethods.handleSubmit(async (data) => {
        onSubmit(data);
    });

    const getAmount = () => {
        let amount = 0;
        for (const ticketType of ticketTypes) {
            amount += ticketType.price * formMethods.watch(ticketType.uuid);
        }
        return amount;
    };

    const getTotalAmount = () => {
        let amount = 0;
        for (const ticketType of ticketTypes) {
            let part = formMethods.watch(ticketType.uuid);
            if (typeof part === 'string') {
                part = parseInt(part);
            }
            amount += part;
        }
        return amount;
    };

    const seatableTickets = ticketTypes.filter((type) => type.seatable);
    const otherTickets = ticketTypes.filter((type) => !type.seatable);

    const ticketSaleOpen = new Date().getTime() > bookingTime * 1000;

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={handleSubmit}>
                {formMethods.formState.errors && ticketTypes && ticketTypes.length > 0 && (
                    <ErrorMessage name={ticketTypes[0].uuid} />
                )}
                <Header2>Billetter(Lar deg være med på LAN)</Header2>
                {seatableTickets.map((ticketType) => (
                    <TypeRow
                        key={ticketType.name}
                        name={ticketType.name}
                        uuid={ticketType.uuid}
                        description={ticketType.description ?? undefined}
                        amount={formMethods.watch(ticketType.uuid)}
                        price={ticketType.price}
                        isSeatable={ticketType.seatable}
                        grantsMembership={ticketType.grants_membership}
                        enabled={ticketSaleOpen || canBypassTicketSaleRestriction}
                        max={10 - getTotalAmount() + formMethods.watch(ticketType.uuid)}
                    />
                ))}
                <Header2>Annet</Header2>
                {otherTickets.map((ticketType) => (
                    <TypeRow
                        key={ticketType.name}
                        name={ticketType.name}
                        uuid={ticketType.uuid}
                        description={ticketType.description ?? undefined}
                        amount={formMethods.watch(ticketType.uuid)}
                        price={ticketType.price}
                        isSeatable={ticketType.seatable}
                        grantsMembership={ticketType.grants_membership}
                        enabled={ticketSaleOpen || canBypassTicketSaleRestriction}
                        max={10 - getTotalAmount() + formMethods.watch(ticketType.uuid)}
                    />
                ))}
                {ticketSaleOpen || canBypassTicketSaleRestriction ? (
                    <>
                        {canBypassTicketSaleRestriction ? (
                            <>
                                <Header2>Du har spesielle tillatelser</Header2>
                                <p>
                                    Billettsalget åpner {new Date(bookingTime * 1000).toLocaleString()}, men du kan
                                    kjøpe billetter allerede da du har spesialtillatelse
                                </p>
                            </>
                        ) : null}
                        <PositiveButton
                            fluid={true}
                            disabled={getAmount() === 0}
                        >{`Betal ${getAmount()},-`}</PositiveButton>
                    </>
                ) : (
                    <>
                        <Header2>Billettsalget har ikke åpnet</Header2>
                        <p>Billettsalget åpner {new Date(bookingTime * 1000).toLocaleString()}</p>
                    </>
                )}
            </Form>
            <RadarEventInfo />
        </FormProvider>
    );
};
