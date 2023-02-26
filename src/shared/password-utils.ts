import { genSalt, hash } from 'bcrypt';

export const generatePasswordHash = async (password: string): Promise<string> => {
  const salt = await genSalt();

  return hash(password, salt);
};
