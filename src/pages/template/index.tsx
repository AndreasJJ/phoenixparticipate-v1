/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Transition, TransitionStatus } from 'react-transition-group';
import { ActiveLink } from './ActiveLink';
import { useSwipeable } from 'react-swipeable';
import { Outlet } from 'react-router-dom';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: inherit;
    min-height: inherit;
    width: inherit;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: inherit;
    height: calc(100% - ${({ theme }) => theme.headerHeight});
`;

// ************** Sidebar **************
const ANIMATION_DURATION = 250;

const Sidebar = styled.div<{ state: TransitionStatus }>`
    background-color: ${({ theme }) => theme.colors.LightGray};
    display: flex;
    height: 100%;
    min-height: inherit;
    box-sizing: border-box;
    overflow: hidden;

    transition: width ${ANIMATION_DURATION}ms;
    ${({ state }) => {
        switch (state) {
            case 'entering':
                return 'width: 0px;';
            case 'entered':
                return 'width: 100vw;';
            case 'exiting':
                return 'width: 100vw;';
            case 'exited':
                return 'width: 0px;';
        }
    }}

    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        height: -webkit-fill-available;
    }

    @media (min-width: ${({ theme }) => theme.media.smallTablet}) {
        ${({ state }) => {
            switch (state) {
                case 'entering':
                    return 'width: 0px;';
                case 'entered':
                    return 'width: 250px;';
                case 'exiting':
                    return 'width: 250px;';
                case 'exited':
                    return 'width: 0px;';
            }
        }}
    }
`;

const Padding = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.m};
    width: 100%;
`;

const Links = styled.div<{ state: TransitionStatus }>`
    display: flex;
    flex-direction: column;

    transition: opacity ${ANIMATION_DURATION}ms;
    ${({ state }) => {
        switch (state) {
            case 'entering':
                return 'opacity: 0;';
            case 'entered':
                return 'opacity: 1;';
            case 'exiting':
                return 'opacity: 1;';
            case 'exited':
                return 'opacity: 0;';
        }
    }}
`;
// ************** Sidebar **************

const Content = styled.section<{ state: TransitionStatus }>`
    height: 100%;
    width: 100%;
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadow.levelEffect};

    transition: width ${ANIMATION_DURATION}ms;
    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        ${({ state }) => {
            switch (state) {
                case 'entering':
                    return 'width: 100%;';
                case 'entered':
                    return 'width: 0;';
                case 'exiting':
                    return 'width: 0;';
                case 'exited':
                    return 'width: 100%;';
            }
        }}
    }
`;

export const Template: React.FC = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // This is needed to disable iOS's swipe left/right geasture to navigate back and forth in the history
    // we do this to allow a swip to the right to open the sidebar
    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.addEventListener('touchstart', (e) => {
                if (e.touches[0].pageX > 30 && e.touches[0].pageX < window.innerWidth - 10) {
                    return;
                }
                e.preventDefault();
            });
        }
    }, []);

    const onClick = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handlers = useSwipeable({
        onSwipedRight: (e) => {
            if (e.initial[0] < 30) {
                setIsSidebarVisible(true);
            }
        },
        onSwipedLeft: (e) => {
            if (e.initial[0] > window.innerWidth - 30) {
                setIsSidebarVisible(false);
            }
        },
        ...{
            delta: 10,
            preventDefaultTouchmoveEvent: false,
            trackTouch: true,
            trackMouse: false,
            rotationAngle: 0,
        },
    });

    return (
        <Wrapper ref={wrapperRef}>
            <Header onClick={onClick} />
            <Container {...handlers}>
                <Transition in={isSidebarVisible} timeout={0}>
                    {(state) => (
                        <>
                            <Sidebar state={state}>
                                <Padding>
                                    <Transition in={isSidebarVisible} timeout={0}>
                                        {(state) => (
                                            <Links state={state}>
                                                <ActiveLink to="/" onClick={onClick}>
                                                    Mine billetter
                                                </ActiveLink>
                                                <ActiveLink to="/buy" onClick={onClick}>
                                                    Kjøp billetter
                                                </ActiveLink>
                                                <ActiveLink to="/membership" onClick={onClick}>
                                                    Medlemskap
                                                </ActiveLink>
                                                <ActiveLink to="/seating" onClick={onClick}>
                                                    Seating
                                                </ActiveLink>
                                                <ActiveLink to="/crew" onClick={onClick}>
                                                    Søk crew
                                                </ActiveLink>
                                                <ActiveLink to="/my-crew" onClick={onClick}>
                                                    Mitt crew
                                                </ActiveLink>
                                                <ActiveLink to="/friends" onClick={onClick}>
                                                    Venner
                                                </ActiveLink>
                                            </Links>
                                        )}
                                    </Transition>
                                </Padding>
                            </Sidebar>
                            <Content state={state}>
                                <Outlet />
                            </Content>
                        </>
                    )}
                </Transition>
            </Container>
        </Wrapper>
    );
};
