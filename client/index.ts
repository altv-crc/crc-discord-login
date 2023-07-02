import * as alt from 'alt-client';
import * as native from 'natives';

// !! alt:V Cross Resource Community, change if you want
// !! Remember to add `http://127.0.0.1` as a redirect for oAuth2
const DISCORD_APP_ID = '1124918226757885995';

alt.onceServer('crc-discord-login-request-auth', async () => {
    native.doScreenFadeOut(0);

    await alt.Utils.wait(1000);

    native.beginTextCommandBusyspinnerOn('STRING');
    native.addTextComponentSubstringPlayerName(`Authenticating`);
    native.endTextCommandBusyspinnerOn(1);

    try {
        const token = await alt.Discord.requestOAuth2Token(DISCORD_APP_ID);

        // player: alt.Player, bearerToken: string
        alt.emitServer('crc-discord-login-bearer-token', token);
    } catch (e) {
        console.log(e);

        // player: alt.Player, bearerToken: string
        alt.emitServer('crc-discord-login-bearer-token', undefined);
    }
});

alt.onceServer('crc-discord-login-done', () => {
    if (native.busyspinnerIsDisplaying()) {
        native.busyspinnerOff();
    }

    native.doScreenFadeIn(1000);
});
