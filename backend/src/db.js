import pg from 'pg';
const { Pool } = pg;


const pool = new Pool({
    user: 'chuaqiyi',
    host: 'localhost',
    database: 'task-manager-db',
    password: '',
    port: 5432,
});

export default pool;