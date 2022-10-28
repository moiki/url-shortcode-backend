import * as dotenv from "dotenv";
dotenv.config();
const config = {
    node_env: process.env.NODE_ENV || "development",
    allowed_origins: JSON.parse(process.env.ALLOWED_ORIGINS!) || [],
    base_url: process.env.BASE_URL || "http://localhost:5000",
    port: process.env.PORT || 5000,
    mongo_url: process.env.MONGO_URL || "",
    database: process.env.MONGO_DB,
    app_id: process.env.APP_KEY || "",
    db_name: process.env.DB_NAME || "url_shortcode_db",
    db_user: process.env.DB_USER || "",
    db_pass: process.env.DB_PASSWORD || "",
    db_host: process.env.DB_HOST || "",
    db_port: Number(process.env.DB_PORT) || 5432,
    environment: process.env.NODE_ENV || "",
};

export default config;