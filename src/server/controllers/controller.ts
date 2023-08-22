import { prisma } from "../db";


export const testFunc = () => {
    return [10, 20, 30, 40, 50]
}

export const multiplyFunc = (multiplier: number, multiplicand: number,) => {
    const result = multiplier * multiplicand;
    return result;
}

export const dbGetAllUsers = async () => {
    const result = await prisma.user.findMany();
    console.log(result);
    return result;
}