
import { DatabaseAdapter, DatabaseConfig } from '../types/database';
import { SQLiteAdapter } from './sqlite-adapter';
import { SupabaseAdapter } from './supabase-adapter';

export class DatabaseFactory {
  static async create(config: DatabaseConfig): Promise<DatabaseAdapter> {
    let adapter: DatabaseAdapter;

    switch (config.type) {
      case 'sqlite':
        if (!config.sqlite?.dbPath) {
          throw new Error('SQLite database path is required');
        }
        adapter = new SQLiteAdapter(config.sqlite.dbPath);
        break;
        
      case 'supabase':
        if (!config.supabase?.url || !config.supabase?.anonKey) {
          throw new Error('Supabase URL and anonymous key are required');
        }
        adapter = new SupabaseAdapter(config.supabase.url, config.supabase.anonKey);
        break;
        
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }

    await adapter.connect();
    return adapter;
  }
}
