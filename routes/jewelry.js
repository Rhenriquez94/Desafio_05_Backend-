import express from 'express';
import { getAllJewelry, countJewelry, filterJewelry } from '../models/jewelry.js';
import logger from '../middleware/logger.js';


const router = express.Router();
// Middleware
router.use(logger);

router.get('/joyas', async (req, res) => {
    try {
        let { limits, page, order_by, ...filters } = req.query;

        const [sortBy, sortOrder] = order_by ? order_by.split('_') : ['id', 'ASC'];

        limits = parseInt(limits) || 10;
        page = parseInt(page) || 1;

        const offset = (page - 1) * limits;

        const jewelry = await getAllJewelry(filters, limits, offset, sortBy, sortOrder, req);
        const totalJewelry = await countJewelry(filters);
        const totalPages = Math.ceil(totalJewelry / limits);

        res.json({
            data: jewelry,
            total: totalJewelry,
            limits,
            page,
            totalPages,
            _links: {
                self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                next: page < totalPages ? `${req.protocol}://${req.get('host')}/api/joyas?limits=${limits}&page=${page + 1}` : null,
                prev: page > 1 ? `${req.protocol}://${req.get('host')}/api/joyas?limits=${limits}&page=${page - 1}` : null,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/joyas/filtros', async (req, res) => {
    try {
        const { precio_min, precio_max, categoria, metal } = req.query;

        const jewelry = await filterJewelry(precio_min, precio_max, categoria, metal, req);

        res.json({
            data: jewelry,
            _links: {
                self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;