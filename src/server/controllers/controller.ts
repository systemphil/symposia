import { prisma } from "../db";

// TODO examples to test with, CLEANUP once done
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