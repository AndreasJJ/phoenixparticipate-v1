/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';
import { useCrews } from '../../hooks/api/useCrews';
import { Header1 } from '../Header1';
import { Header2 } from '../Header2';

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Select = styled.select`
    width: 100%;
    height: 30px;

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.M};
    }
`;

interface Props {
    onlyActive?: boolean;
    onlyApplyable?: boolean;
}

export const CrewSelect: React.FC<Props> = ({ onlyActive, onlyApplyable }) => {
    const { data, isLoading, isLoadingError } = useCrews();
    const [selected, setSelected] = useState('');
    const crews = data
        ?.filter((crew) => (onlyActive ? crew.active : true))
        .filter((crew) => (onlyApplyable ? crew.is_applyable : true));

    const { register } = useFormContext();

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value);
    };

    const selectedCrew = crews?.find((crew) => crew.uuid === selected);

    return (
        <Wrapper>
            <Select
                {...register('selectedCrew')}
                disabled={isLoading || isLoadingError}
                value={selected}
                onChange={onChange}
            >
                <option value="" disabled>
                    {(isLoading && 'Loading...') || (isLoadingError && 'Failed to load crew') || 'Select Crew'}
                </option>
                {crews?.map((crew) => (
                    <option value={crew.uuid} key={crew.uuid}>
                        {crew.name}
                    </option>
                ))}
            </Select>
            {selected !== '' && selectedCrew?.application_prompt ? (
                <>
                    <Header2>Crewet du valgte har ekstra ting de vil ha i søknaden</Header2>
                    <p>
                        Crewet vil ha litt mer informasjon. Legg følgende med i søknaden for en bedre sjanse til å få
                        søknaden godkjent:
                    </p>
                    <p>
                        <i>{selectedCrew.application_prompt}</i>
                    </p>
                </>
            ) : null}
            <ErrorMessage name="selectedCrew" />
        </Wrapper>
    );
};
