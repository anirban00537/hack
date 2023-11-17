import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, Patch, Delete } from '@nestjs/common';

import { Roles } from '@/decorators/role';
import { AuthGuard } from '@/guards/auth/auth.guard';
import { UserRole } from '@/utils/constants';
import { CreateSchoolDTO, UpdateSchoolDTO } from '@/modules/school/dto/school.dto';
import { SchoolService } from '@/modules/school/school.service';
import { successResponseBuilder } from '@/utils/responseBuilder';
import { queryParamsWithPageDetails } from '@/utils/paginationBuilder';


@Controller('school')
export class SchoolController {
  constructor(private readonly service: SchoolService) { }

  @Roles(UserRole.superAdmin)
  @UseGuards(AuthGuard)
  @Post('')
  public async create(@Body() body: CreateSchoolDTO) {
    const response = await this.service.createSchool(body);
    return successResponseBuilder(response);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.superAdmin)
  @Get('')
  public async all(@Req() req) {
    const { data, meta } = await this.service.getAll(queryParamsWithPageDetails(req));
    return successResponseBuilder(data, meta);
  }

  @Roles(UserRole.superAdmin)
  @UseGuards(AuthGuard)
  @Get('/:id')
  public async getOne(@Param('id') id: string) {
    const response = await this.service.findById(id);
    return successResponseBuilder(response);
  }

  // @Roles(UserRole.superAdmin)
  // @UseGuards(AuthGuard)
  // @Put('/:id')
  // public async update(@Param('id') id: string, @Body() body: UpdateSchoolDTO) {
  //   const response = await this.service.update(id, body);
  //   return successResponseBuilder(response);
  // }

  @Roles(UserRole.superAdmin)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateStatus(@Param('id') id: string, @Body() body: UpdateSchoolDTO) {

    const response = await this.service.updateStatus(id, body);
    return successResponseBuilder(response);
  }

  @Roles(UserRole.superAdmin)
  @UseGuards(AuthGuard)
  @Post('/blackboard')
  public async createBlackboardSchool(@Body() body: CreateSchoolDTO) {
    const response = await this.service.createBlackboardSchool(body);
    return successResponseBuilder(response);
  }
  @Roles(UserRole.superAdmin)
  @UseGuards(AuthGuard)
  @Put('/blackboard/:id')
  public async updateBlackboardSchool(@Param('id') id: string, @Body() body: UpdateSchoolDTO) {
    const response = await this.service.updateBlackboardSchool(id, body);
    return successResponseBuilder(response);
  }

  @Roles(UserRole.superAdmin)
  @UseGuards(AuthGuard)
  @Get('/blackboard')
  public async fetchAllBlackboardSchool(@Req() req) {

    const { data, meta } = await this.service.getAll(queryParamsWithPageDetails(req));
    return successResponseBuilder(data, meta);
  }
  @Roles(UserRole.superAdmin)
  @UseGuards(AuthGuard)
  @Delete('/blackboard/:id')
  public async deleteBlackboardSchool(@Param('id') id: string) {
    const deletedSchool = await this.service.delteBlackboardSchool(id);
    return successResponseBuilder(deletedSchool);
  }
}
