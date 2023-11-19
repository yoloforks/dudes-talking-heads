# Talking Heads (Dudes, Челы)

Animated characters for chatters in your stream.

## Features

When a chatter send a meassage, the dude appears with the message box.

Dude has simple type of animations: idle, run, jump, fall, land.

## Usage

The preinstalled version can be used on your stream right now.

Preview: http://dudes.mikedanagam.space/user/mikedanagam

Open OBS or any streaming tool which supported browser overlay.

Put URL to the browser source.

## Development

This is mono repo which contains frontend and backend.
Frontend uses PIXI JS for rendering dudes.

```
npm install
npm run dev
```

Then open: http://localhost:5173/user/{your_twitch_user_channel}

Send a message in your channel.

## Creating new sprites

It's really easy to create sprites with [Aseprite](https://github.com/aseprite/aseprite)

Sprite size is 32x32.

Example can be found in aseprite folder.

## Contributing

If you'd like to contribute to this project, please feel free to create pull requests.
