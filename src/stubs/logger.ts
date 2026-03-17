const noop = (_?: unknown, __?: unknown) => {};

export const logger = {
  info: noop,
  warn: noop,
  error: noop,
  debug: noop
};
