import { createConnection } from 'typeorm';

export const connectDatabase = async () => {
  try {
    await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'bosscard',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
