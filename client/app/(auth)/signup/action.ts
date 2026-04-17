"use server"

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
    success: boolean;
    message: string;
}

export async function signup(prevState: LoginState | undefined, data: FormData): Promise<LoginState> {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const name = data.get("name") as string;
    const confirmPassword = data.get("confirm-password") as string;


    if (!email || !password || !name || !confirmPassword) {
        return {
            success: false,
            message: "Email and password are required."
        }
    }

    if (password !== confirmPassword) {
        return {
            success: false,
            message: "Passwords do not match."
        }
    }

    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signup`, {
            email,
            password,
            name
        });

        if (res.status !== 201) throw new Error(res.data?.message || "Signup failed.");

        const setCookieHeaders = res.headers['set-cookie'];
        
        if (setCookieHeaders) {
            const jwtCookieString = setCookieHeaders.find(c => c.startsWith('jwt='));
            
            if (jwtCookieString) {
                const tokenValue = jwtCookieString.split(';')[0].split('=')[1];
                
                (await cookies()).set({
                    name: 'jwt',
                    value: tokenValue,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 60 * 60 * 24 
                });
            }
        }

        (await cookies()).set("temp_email", email, { maxAge: 60 * 5 }); // expires in 5 mins
        
        return {
            success: true,
            message: res.data?.message || "Signup successful!"
        }
        
    } catch(err: any) {
        console.log(err);
        
        return {
            success: false,
            message: err.response?.data?.message || err?.message || "An error occurred during signup."
        }
    }
}