export type Chatters = {
  [key: string]: {
    sprite: string;
  };
};

export type Config = {
  chatters: Chatters;
};

export const config: Config = {
  chatters: {
    nets1l: {
      sprite: 'dude',
    },
    St_zarus: {
      sprite: 'dude',
    },
  },
};
