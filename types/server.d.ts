import * as alt from 'alt-server';
import { Account } from '../shared/interfaces';

declare module 'alt-server' {
    export function on<T = Account>(
        eventName: 'crc-discord-login-finish',
        listener: (player: alt.Player, account: T) => void
    ): void;
}
