import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from "../../utils/logger";
import prisma from '../../utils/prisma';
interface AuthenticatedRequest extends Request {
    user?: any
}
const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        logger.warn(`[/auth] - token missing`);
        logger.debug(`[/auth] - token: ${token}`);
        return res.status(401).json({
            data: {
                error: 'No token provided.'
            }
        });
    }
    try {
        const payload = await jwt.verify(token.toString(), process.env.JWT_SECRET!) as JwtPayload;
        const user = await prisma.user.findFirst({
            where: {
                userId: payload.userId
            }
        });
        
        if (!user) {
            logger.warn(`[/auth] - user not found`);
            return res.status(401).json({
                data: {
                    error: 'Invalid access token.'
                }
            });
        }
        logger.info(`[/auth] - user: ${user?.userId} authenticated`);
        req.user = user;
        next();
    } catch (error: any) {
        logger.error(`[/auth] - ${error.message}`);
        return res.status(500).json({
            error: 'Failed to authenticate token.'
        });
    }
}

export { verifyJWT };