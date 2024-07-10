import { query, format } from '../config/db.js';

const getAllJewelry = async (filters, limit, offset, sortBy, sortOrder, req) => {
    const filterClauses = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(filters)) {
        filterClauses.push(format('%I = $%s', key, i));
        values.push(value);
        i++;
    }

    const filterQuery = filterClauses.length > 0 ? 'WHERE ' + filterClauses.join(' AND ') : '';
    const orderQuery = format('ORDER BY %I %s', sortBy, sortOrder);
    const limitOffsetQuery = `LIMIT $${i} OFFSET $${i + 1}`;
    values.push(limit, offset);

    const sql = `
        SELECT * FROM inventario
        ${filterQuery}
        ${orderQuery}
        ${limitOffsetQuery}
    `;

    const result = await query(sql, values);
    return result.rows.map(row => ({
        ...row,
        _links: {
            self: `${req.protocol}://${req.get('host')}/api/joyas/${row.id}`,
            category: `${req.protocol}://${req.get('host')}/api/joyas?categoria=${row.categoria}`,
            metal: `${req.protocol}://${req.get('host')}/api/joyas?metal=${row.metal}`,
        }
    }));
};

const countJewelry = async (filters) => {
    const filterClauses = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(filters)) {
        filterClauses.push(format('%I = $%s', key, i));
        values.push(value);
        i++;
    }

    const filterQuery = filterClauses.length > 0 ? 'WHERE ' + filterClauses.join(' AND ') : '';

    const sql = `
        SELECT COUNT(*) FROM inventario
        ${filterQuery}
    `;

    const result = await query(sql, values);
    return parseInt(result.rows[0].count, 10);
};

const filterJewelry = async (minPrice, maxPrice, category, metal, req) => {
    const filterClauses = [];
    const values = [];
    let i = 1;

    if (minPrice !== undefined) {
        filterClauses.push(`precio >= $${i++}`);
        values.push(minPrice);
    }
    if (maxPrice !== undefined) {
        filterClauses.push(`precio <= $${i++}`);
        values.push(maxPrice);
    }
    if (category) {
        filterClauses.push(`categoria = $${i++}`);
        values.push(category);
    }
    if (metal) {
        filterClauses.push(`metal = $${i++}`);
        values.push(metal);
    }

    const filterQuery = filterClauses.length > 0 ? 'WHERE ' + filterClauses.join(' AND ') : '';

    const sql = `
        SELECT * FROM inventario
        ${filterQuery}
    `;

    const result = await query(sql, values);
    return result.rows.map(row => ({
        ...row,
        _links: {
            self: `${req.protocol}://${req.get('host')}/api/joyas/${row.id}`,
            category: `${req.protocol}://${req.get('host')}/api/joyas?categoria=${row.categoria}`,
            metal: `${req.protocol}://${req.get('host')}/api/joyas?metal=${row.metal}`,
        }
    }));
};

export { getAllJewelry, countJewelry, filterJewelry };