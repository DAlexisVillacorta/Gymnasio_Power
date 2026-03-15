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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserService = exports.getUserByIdService = exports.getUsersService = void 0;
const database_1 = require("../config/database");
const User_entity_1 = require("../entities/User.entity");
const credentialService_1 = require("./credentialService");
const userRepository = database_1.AppDataSource.getRepository(User_entity_1.User);
const getUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.find();
});
exports.getUsersService = getUsersService;
const getUserByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findOne({
        where: { id },
        relations: ["appointments"]
    });
    if (!user)
        throw new Error(`Usuario con id: ${id} no fue encontrado.`);
    return user;
});
exports.getUserByIdService = getUserByIdService;
const registerUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const credentialId = yield (0, credentialService_1.CreateCredentials)(userData.username, userData.password);
    const newUser = userRepository.create({
        name: userData.name,
        email: userData.email,
        nDni: userData.nDni,
        birthdate: new Date(userData.birthdate),
        credential: { id: credentialId }
    });
    yield userRepository.save(newUser);
    return {
        name: newUser.name,
        email: newUser.email
    };
});
exports.registerUserService = registerUserService;
