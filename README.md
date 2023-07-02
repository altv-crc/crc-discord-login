# [CRC][TS] alt:V Discord Login

<sup>Supported by <a href="https://github.com/orgs/altv-crc/">CRC</a></sup>

A simple discord authentication plugin.

## Requires

- [crc-db](https://github.com/altv-crc/crc-db)
- [alt:V TypeScript Project](https://github.com/Stuyk/altv-typescript)
- [alt:V Cross Resource Cache](https://github.com/altv-crc/lib-cross-resource-cache)
- [VSCode - alt:V Event Suggestions](https://marketplace.visualstudio.com/items?itemName=stuyk.altv-event-suggestions)

_Highly recommended to get the extension, for better event handling._

## Installation

0. Install NPM packages

```ts
npm i @stuyk/cross-resource-cache
```

1. Install [crc-db resource](https://github.com/altv-crc/crc-db)

2. Create a folder in your `src` folder called `crc-discord-login`.

3. Add the `TypeScript` files from this resource, to that folder.

4. Modify `server.toml` and ensure it loads whatever you named the folder.

In the case of the example above it should be `crc-discord-login`.

```
resources = [ 
    'crc-db',
    'crc-discord-login',
    'core',
    'dbg_reconnect'
]
```

5. Listen for `crc-discord-login-finish` event.

When a bearer token is passed from a `client` you will get general Discord information through an `alt.on` event.

You should be listening to this event from some other resource.

```ts
interface Account {
    // MongoDB Document ID
    _id: string;
    // Discord Data
    id: string;
    username: string;
    discriminator: number;
}

alt.on('crc-discord-login-finish', (player: alt.Player, account: Account) => {
    player.frozen = false;
    player.model = 'mp_m_freemode_01';
    player.visible = true;
    player.spawn(0, 0, 72);
    console.log(account);
});
```
