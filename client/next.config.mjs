/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites () 
    {
        return [
            {
                "source" : "/f/:formId",
                "destination" : "http://localhost:8080/f/:formId"
            }
        ]
    }
}

export default nextConfig
