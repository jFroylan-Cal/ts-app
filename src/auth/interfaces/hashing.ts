import * as argon2 from 'argon2';

export const HashOptions = {
  type: argon2.argon2id,
  memoryCost: 16384,
  timeCost: 2,
  parallelism: 2,
  hashLength: 32,
  saltLength: 16,
};
