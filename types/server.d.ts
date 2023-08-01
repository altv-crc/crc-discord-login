import * as alt from 'alt-server';
import * as crc from 'alt-crc';

declare module 'alt-server' {
    interface ICustomEmitEvent {
        'crc-discord-login-finish': <T = crc.Account>(player: alt.Player, account: T) => void;
    }
}
