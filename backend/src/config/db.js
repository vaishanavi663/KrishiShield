import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

//const dbUrl = process.env.DATABASE_URL;
const dbUrl = process.env.DATABASE_PUBLIC_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL is not set!");
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;