import pg from 'pg';
const { Pool } = pg;


const pool = new Pool({
    user: 'chuaqiyi',
    host: 'localhost',
    database: 'task_manager',
    password: '',
    port: 5432,
});

export default pool;