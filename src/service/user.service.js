import { putApiLogin } from "../api/api"

export const changePass = data => {
    return putApiLogin('http://192.168.10.105:3333/users', data)
}