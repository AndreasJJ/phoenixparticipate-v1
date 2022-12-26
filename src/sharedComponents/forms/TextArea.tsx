/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const StyledTextArea = styled.textarea`
    width: 100%;
    resize: vertical;
    min-height: 100px;
    max-height: 400px;

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.M};
    }
`;

interface Props {
    name: string;
}

export const TextArea: React.FC<Props> = ({ name }) => {
    const { register } = useFormContext();

    return (
        <Wrapper>
            <StyledTextArea {...register(name)} maxLength={10000} rows={8} />
            <ErrorMessage name={name} />
        </Wrapper>
    );
};
