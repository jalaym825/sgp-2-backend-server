import { Request, Response } from 'express';
import logger from '../../utils/logger';
import prisma from '../../utils/prisma';

const getPlayer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`[/player] - data missing`);
            logger.debug(`[/player] - id: ${id}`);
            return res.status(400).json({
                error: "Invalid id"
            });
        }

        const player = await prisma.cricketPlayer.findUnique({
            where: {
                sis_id: id
            },
        });
        logger.info(`[/player] - player found`);

        return res.status(200).json({
            player
        });
    } catch (error: any) {
        logger.error(`[/player] - ${error.message}`);
        return res.status(500).json({
            error: error.message
        });
    }
}

export default { getPlayer }