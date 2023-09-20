import {dirname} from 'path'
import { fileURLToPath } from 'url'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const hashData = async(data)=>{
    return bcrypt.hash(data,10)
}

export const compareData = async(data,hashData)=>{
    return bcrypt.compare(data,hashData)
}