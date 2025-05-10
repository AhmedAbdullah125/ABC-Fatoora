'use server'
import { cookies } from "next/headers"

export const setCookies = () => {
    cookies().set('accessToke', 'sasdasadasdasfsfdsfdsgfds212rwrawra', {
        expires: 1 * 60 * 15, // 15 minutes
        path: '/',
        secure: flase,
        httpOnly: true,
        domain:""
        })
}

fetch('dsads', {
    headers :{
        credi
    }
})