/*
 * @created 27/03/2021 - 21:47
 * @project phoenixparticipate-v1
 * @author andreasjj
 */

import { Position } from '@phoenixlan/phoenix.js';
import { BasicUserWithExpandedPositions, ExpandedPosition } from './types';

export const getTitles = (user: BasicUserWithExpandedPositions): string => {
    return user.positions.reduce((prev: string, cur: ExpandedPosition, i, arr) => {
        let title = prev;
        if (!cur.team_uuid && cur.chief) {
            title += `Leder`;
        } else if (cur.name) {
            title += `${cur.name}`;
        } else if (cur.team_uuid && cur.chief) {
            title += `Leder av ${cur.team ? cur.team.name : cur.team_uuid}}`;
        } else if (cur.team_uuid) {
            title += `Medlem av ${cur.team ? cur.team.name : cur.team_uuid}`;
        } else {
            title += `Medlem`;
        }

        if (i !== arr.length - 1) {
            title += ', ';
        }

        return title;
    }, '');
};
