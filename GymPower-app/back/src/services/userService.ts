import { AppDataSource } from "../config/database"
import { User } from "../entities/User.entity"
import { UserRegisterDTO, UserRegisterSuccesDTO } from "../../DOTs/UserDOTs"
import { CreateCredentials } from "./credentialService"

const userRepository = AppDataSource.getRepository(User)

export const getUsersService = async () => {
  return await userRepository.find()
}

export const getUserByIdService = async (id: number): Promise<User> => {
  const user = await userRepository.findOne({
    where: { id },
    relations: ["appointments"] 
    
  })

  if (!user) throw new Error(`Usuario con id: ${id} no fue encontrado.`)
  return user
}


export const registerUserService = async (
  userData: UserRegisterDTO
): Promise<UserRegisterSuccesDTO> => {

  const credentialId = await CreateCredentials(userData.username, userData.password)


const newUser = userRepository.create({
  name: userData.name,
  email: userData.email,
  nDni: userData.nDni,
  birthdate: new Date(userData.birthdate),
  credential: { id: credentialId }  
})
  await userRepository.save(newUser)

  return {
    name: newUser.name,
    email: newUser.email
  }
}