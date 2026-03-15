"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = exports.CreateCredentials = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const Credential_entity_1 = require("../entities/Credential.entity");
const User_entity_1 = require("../entities/User.entity");
const SALT_ROUNDS = 10;
const credentialRepository = database_1.AppDataSource.getRepository(Credential_entity_1.Credential);
const userRepository = database_1.AppDataSource.getRepository(User_entity_1.User);
const checkUserExist = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const credential = yield credentialRepository.findOne({ where: { username } });
    if (credential) {
        throw new Error(`El username ${username} ya existe, intente con uno nuevo`);
    }
});
const CreateCredentials = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    yield checkUserExist(username);
    const passwordHash = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    const newCredential = credentialRepository.create({
        username,
        password: passwordHash
    });
    yield credentialRepository.save(newCredential);
    return newCredential.id;
});
exports.CreateCredentials = CreateCredentials;
const checkCredentials = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const credential = yield credentialRepository.findOne({ where: { username } });
    if (!credential)
        throw new Error("Credenciales incorrectas");
    const passwordMatch = yield bcrypt_1.default.compare(password, credential.password);
    if (!passwordMatch)
        throw new Error("Credenciales incorrectas");
    const user = yield userRepository.findOne({
        where: { credential: { id: credential.id } }
    });
    if (!user)
        throw new Error(`Usuario con credencial ${credential.id} no fue encontrado.`);
    return { userId: user.id, username: credential.username };
});
exports.checkCredentials = checkCredentials;
