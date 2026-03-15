export interface UserRegisterDTO {
    name: string,
    email: string,
    nDni: string,
    birthdate: Date,
    username: string,
    password: string
}


export interface UserLoginDTO {
    username: string,
    password: string
}


export interface UserRegisterSuccesDTO {
    name: string,
    email: string
}


export interface UserTurnsDTO {
    id: string,
    date: Date,
    time: Date,
    userId: number ,
    status: string,
    service: string
    }