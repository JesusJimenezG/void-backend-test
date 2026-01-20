/**
 * Schema Sync Script
 * Run this to synchronize the database schema with entities.
 *
 * Usage:
 *   npx ts-node src/scripts/sync-schema.ts
 *   OR in Docker: node dist/scripts/sync-schema.js
 */

import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Load environment
ConfigModule.forRoot({
  envFilePath: ['.env', '../.env'],
});

const configService = new ConfigService();

async function syncSchema() {
  console.log('🔄 Starting schema synchronization...');

  const host =
    process.env.TYPEORM_HOST || configService.get<string>('TYPEORM_HOST');
  const port = parseInt(
    process.env.TYPEORM_PORT || configService.get<string>('TYPEORM_PORT'),
    10,
  );

  const dataSource = new DataSource({
    type: 'postgres',
    host,
    port,
    username:
      process.env.TYPEORM_USERNAME ||
      configService.get<string>('TYPEORM_USERNAME'),
    password:
      process.env.TYPEORM_PASSWORD ||
      configService.get<string>('TYPEORM_PASSWORD'),
    database:
      process.env.TYPEORM_DATABASE ||
      configService.get<string>('TYPEORM_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Force sync
    logging: true,
  });

  try {
    console.log(`📡 Connecting to ${host}:${port}...`);
    await dataSource.initialize();
    console.log('✅ Schema synchronized successfully!');

    // Show created tables
    const tables = await dataSource.query(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
    );
    console.log(
      '📋 Tables in database:',
      tables.map((t: any) => t.tablename),
    );
  } catch (error) {
    console.error('❌ Schema sync failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Connection closed.');
  }
}

syncSchema();
