import axios from 'axios';

const isServer = typeof window === 'undefined';

// On the server (Next.js Server Actions) we need an absolute URL that resolves inside the
// Docker network; use `http://server:8080/api` as a sensible default. Browser clients should use
// a relative `/api` path so requests go through the reverse proxy on the same origin.
const serverBase = process.env.NEXT_PUBLIC_BACKEND_URL_SERVER || 'http://server:8080/api';
const clientBase = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

export const api = axios.create({
    baseURL: isServer ? serverBase : clientBase,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Add the Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that fall outside the range of 2xx cause this function to trigger
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
                const isPublic = window.location.pathname === '/' || publicPaths.some(p => window.location.pathname.startsWith(p));
                if (!isPublic) {
                    console.warn("Unauthorized! Redirecting to login...");
                    const nextURL = encodeURIComponent(window.location.pathname + window.location.search);
                    window.location.href = `/login?next=${nextURL}&guard=api`;
                
                }
            }
        }
        
        // Reject the promise so your component's catch() block still runs if needed
        return Promise.reject(error);
    }
);