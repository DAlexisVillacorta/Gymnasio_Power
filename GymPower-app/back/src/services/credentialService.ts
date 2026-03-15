import bcrypt from "bcrypt";
import { AppDataSource } from "../config/database";
import { Credential } from "../entities/Credential.entity";
import { User } from "../entities/User.entity";

const SALT_ROUNDS = 10;

const credentialRepository = AppDataSource.getRepository(Credential);
const userRepository = AppDataSource.getRepository(User);

const checkUserExist = async (username: string): Promise<void> => {
  const credential = await credentialRepository.findOne({ where: { username } });
  if (credential) {
    throw new Error(`El username ${username} ya existe, intente con uno nuevo`);
  }
};

export const CreateCredentials = async (
  username: string,
  password: string
): Promise<number> => {
  await checkUserExist(username);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const newCredential = credentialRepository.create({
    username,
    password: passwordHash
  });

  await credentialRepository.save(newCredential);
  return newCredential.id;
};

export const checkCredentials = async (
  username: string,
  password: string
): Promise<{ userId: number; username: string }> => {
  const credential = await credentialRepository.findOne({ where: { username } });
  if (!credential) throw new Error("Credenciales incorrectas");

  const passwordMatch = await bcrypt.compare(password, credential.password);
  if (!passwordMatch) throw new Error("Credenciales incorrectas");

  const user = await userRepository.findOne({
    where: { credential: { id: credential.id } }
  });

  if (!user)
    throw new Error(`Usuario con credencial ${credential.id} no fue encontrado.`);

  return { userId: user.id, username: credential.username };
};
