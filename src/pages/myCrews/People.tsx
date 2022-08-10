/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { PersonCard } from './PersonCard';
import { User } from '@phoenixlan/phoenix.js';

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        justify-content: center;
    }
`;

interface Props {
    people: Array<User.BasicUserWithPositions>;
}

export const People: React.FC<Props> = ({ people }) => {
    return (
        <Grid>
            {people.map((person) => (
                <PersonCard key={person.uuid} {...person} />
            ))}
        </Grid>
    );
};