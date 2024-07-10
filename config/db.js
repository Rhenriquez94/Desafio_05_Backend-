import pkg from 'pg';
const { Pool } = pkg;
import format from 'pg-format';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'joyas',
    password: '123',
    port: 5432,
});

const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } finally {
        client.release();
    }
};

export { query, format };
