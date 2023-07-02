# [CRC][TS] alt:V Discord Login

<sup>Supported by <a href="https://github.com/orgs/altv-crc/">CRC</a></sup>

A simple discord authentication plugin.

## Requires

- TypeScript
- https://github.com/Stuyk/altv-typescript
- [alt:V Event Suggestions](https://marketplace.visualstudio.com/items?itemName=stuyk.altv-event-suggestions)

_Highly recommended to get the extension, for better event handling._

## Installation

* Create a folder in your `src` folder called `crc-discord-login`.

* Add the `TypeScript` files from this resource, to that folder.

_You can also `git clone` directly into your `src` folder._

## Setup

Modify `server.toml` and ensure it loads whatever you named the folder.

In the case of the example above it should be `crc-discord-login`.

```
resources = [ 
    'crc-discord-login',
    'core',
    'dbg_reconnect'
]
```

## Listen to Event

When a bearer token is passed from a `client` you will get general Discord information through an `alt.on` event.

```ts
alt.on('crc-discord-login-finish', (player: alt.Player, id: string, username: string, discriminator: number) => {
    // player is an alt.Player instance
    // id is their discord identifier
    // username is their discord username
});
```
