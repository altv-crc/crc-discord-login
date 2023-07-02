import * as alt from 'alt-server';
import * as crc from '@stuyk/cross-resource-cache';
import * as I from './interfaces';

const COLLECTION_NAME = 'account';
const loginRequest: { [id: string]: boolean } = {};
let isDatabaseReady = false;

crc.database.onReady(() => {
    isDatabaseReady = true;
});

alt.log(`~c~[CRC] Discord Login Started`);

alt.on('playerConnect', (player: alt.Player) => {
    loginRequest[player.id] = true;
    player.dimension = player.id + 1;
    player.visible = false;
    player.frozen = true;
    player.pos = new alt.Vector3(0, 0, 100);
    player.emit('crc-discord-login-request-auth');
});

alt.on('playerDisconnect', (player: alt.Player) => {
    delete loginRequest[player.id];
});

alt.onClient('crc-discord-login-bearer-token', async (player: alt.Player, bearerToken: string) => {
    if (!bearerToken) {
        player.kick(`Discord Application was not launched. Rejoin with Discord Launched.`);
        return;
    }

    if (!loginRequest[player.id]) {
        player.kick('No login request found. Rejoin server.');
        return;
    }

    const request: Response = await fetch('https://discordapp.com/api/users/@me', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${bearerToken}`,
        },
    }).catch((err) => {
        console.log(err);
        return undefined;
    });

    // Check if the request was successful and if the neccessary properties are included
    if (!request || !request.ok) {
        delete loginRequest[player.id];
        player.kick('Could not authorize with bearer token. Rejoin server.');
        return;
    }

    const data = await request.json();
    if (!data.username || !data.id) {
        player.kick('Discord data was invalid. Rejoin server.');
        return;
    }

    delete loginRequest[player.id];

    player.emit('crc-discord-login-done');
    player.dimension = 0;

    await alt.Utils.waitFor(() => isDatabaseReady, 30000);

    let account: I.Account = await crc.database.get<I.Account>({ id: data.id }, COLLECTION_NAME);
    if (!account) {
        const documentID = await crc.database.create<I.Account>(
            { id: data.id, username: data.username, discriminator: data.discriminator },
            COLLECTION_NAME
        );

        account = await crc.database.get<I.Account>({ _id: documentID }, COLLECTION_NAME);
    } else {
        alt.log(`Existing Account Authenticated - ${data.username}#${data.discriminator}`);
    }

    // player: alt.Player, account: { _id: string, discord: string, username: string, discriminator: number }
    alt.emit('crc-discord-login-finish', player, account);
});
