import { headers } from "next/headers";

export function serverGetDomain() {
    const headersList = headers();
    const domain = headersList.get("x-origin");
    if (!domain) {
        console.log("[Error] serverGetDomain() domain is missing");
        throw new Error("[Error] serverGetDomain() domain is missing");
    }
    return domain;
}