import { PrismaClient } from "@prisma/client";

class Prisma extends PrismaClient {
    OTP: any;
    constructor(options = {}) {
        super(options);
        
    }
    // inplement chaching in future maybe
}

const prisma = new Prisma();
export default prisma;