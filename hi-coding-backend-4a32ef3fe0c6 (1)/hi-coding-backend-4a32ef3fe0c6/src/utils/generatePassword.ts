import * as crypto from 'crypto';

export const generatePassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randChars = crypto.randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i++) {
    const index = randChars[i] % chars.length;
    password += chars.charAt(index);
  }
  return password;
};
