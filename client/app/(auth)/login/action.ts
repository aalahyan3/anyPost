"use server"

import { api } from "@/app/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
    success: boolean;
    message: string;
}

export async function login(prevState: LoginState | undefined, data: FormData): Promise<LoginState> {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (!email || !password) {
        return {
            success: false,
            message: "Email and password are required."
        }
    }

    try {
        const res = await api.post(`/v1/auth/signin`, {
            email,
            password
        });

        if (res.status !== 200) throw new Error(res.data?.message || "Login failed.");

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
                    // use 'lax' so the cookie is sent on top-level navigations and cross-port requests
                    sameSite: 'lax',
                    // ensure cookie is valid for localhost domain so it is sent to :8080 as well
                    domain: 'localhost',
                    path: '/',
                    maxAge: 60 * 60 * 24 
                });
            }
        }

        return {
            success: true,
            message: "Login successful!"
        }
        
    } catch(err: any) {
        return {
            success: false,
            message: err.response?.data?.message || "An error occurred during login."
        }
    }
}