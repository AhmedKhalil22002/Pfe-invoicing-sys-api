import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/modules/user-management/services/permission.service';
import { permitedActions, permitedEntities } from './data/permissions.data';

@Injectable()
export class PermissionsSeederCommand {
  constructor(private readonly permissionService: PermissionService) {}

  @Command({
    command: 'seed:permissions',
    describe: 'seed system permissions',
  })
  async seed() {
    const start = new Date();
    console.log('Starting seeding of permissions');

    for (const entity of permitedEntities) {
      for (const action of permitedActions) {
        await this.permissionService.save({
          id: `${action}-${entity}`,
          label: `${action.toUpperCase()}_${entity.toUpperCase()}`,
          description: `This permission is for ${action} ${entity}`,
        });
      }
    }

    const end = new Date();
    console.log(`Seeding completed in ${end.getTime() - start.getTime()}ms`);
  }
}
