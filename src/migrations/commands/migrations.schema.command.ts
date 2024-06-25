import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { Connection } from 'typeorm';

@Injectable()
export class MigrationSchemaCommand {
  constructor(private readonly connection: Connection) {}

  @Command({
    command: 'schema:destroy',
    describe: 'Destroys the entire database schema',
  })
  async destroySchema(): Promise<void> {
    try {
      await this.connection.dropDatabase();
      console.log('Database schema destroyed successfully.');
    } catch (error) {
      console.error(`Failed to destroy schema: ${error.message}`);
    }
  }
}
