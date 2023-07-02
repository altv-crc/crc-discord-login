import * as alt from 'alt-server';

alt.log(`~c~[CRC] Discord Login Started`);

const loginRequest: { [id: string]: boolean } = {};

alt.on('playerConnect', (player: alt.Player) => {
    loginRequest[player.id] = true;
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

    // Just to give a little bit of 'reconnect' effect.
    await alt.Utils.wait(1000);

    alt.log(`Authenticated: ${data.username}`);

    player.emit('crc-discord-login-done');

    // player: alt.Player, discord: string, username: string, discriminator: number
    alt.emit('crc-discord-login-finish', player, data.id, data.username, data.discriminator);
});
