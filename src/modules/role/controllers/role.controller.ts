import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { UpdateRoleDto } from '../dtos/role.update.dto';
import { ResponseRoleDto } from '../dtos/role.response.dto';
import { CreateRoleDto } from '../dtos/role.create.dto';
import { RoleService } from '../services/role.service';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { PageDto } from 'src/common/database/dtos/database.page.dto';

@ApiTags('role')
@Controller({
  version: '1',
  path: '/role',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseRoleDto[]> {
    return await this.roleService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseRoleDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseRoleDto>> {
    return await this.roleService.findAllPaginated(query);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(
    @Param('id') id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponseRoleDto> {
    if (query.filter) query.filter += `,id||$eq||${id}`;
    else query.filter = `id||$eq||${id}`;
    return await this.roleService.findOneByCondition(query);
  }

  @Post('/duplicate/:id')
  async duplicate(@Param('id') id: number): Promise<ResponseRoleDto> {
    return await this.roleService.duplicate(id);
  }

  @Post('')
  async save(@Body() createRoleDto: CreateRoleDto): Promise<ResponseRoleDto> {
    return await this.roleService.save(createRoleDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseRoleDto> {
    return await this.roleService.update(id, updateRoleDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseRoleDto> {
    return await this.roleService.softDelete(id);
  }
}
