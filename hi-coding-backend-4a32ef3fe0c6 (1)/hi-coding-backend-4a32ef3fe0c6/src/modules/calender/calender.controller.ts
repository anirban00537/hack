import { Controller, Body, Query, Put, Post, Get, Delete, Patch, UseGuards, Req, Param } from '@nestjs/common';
import { CalenderService } from './calender.service';
import { Roles } from '@/decorators/role';
import { UserRole } from '@/utils/constants';
import { successResponseBuilder } from '@/utils/responseBuilder';
import { CreateCalenderEventDTO, UpdateCalenderEventDTO } from './dto/calender.dto';
import { queryParamsWithPageDetails } from '@/utils/paginationBuilder';
import { AuthGuard } from '@/guards/auth/auth.guard';

@Controller('calender')
export class CalenderController {
    constructor(private service: CalenderService) {

    }
    @Roles(UserRole.superAdmin, UserRole.schoolManager)
    @UseGuards(AuthGuard)
    @Post('/school')
    public async create(@Body() body: CreateCalenderEventDTO) {
        const response = await this.service.create(body);
        return successResponseBuilder(response);
    }

    @UseGuards(AuthGuard)
    @Roles(UserRole.superAdmin)
    @Get('')
    public async findAll(@Req() req) {
        const { data, meta } = await this.service.findAll(queryParamsWithPageDetails(req));
        return successResponseBuilder(data, meta);
    }

    @UseGuards(AuthGuard)
    @Roles(UserRole.superAdmin, UserRole.schoolManager, UserRole.student)
    @Get('/school')
    public async findBySchool(@Req() req) {
        const { data, meta } = await this.service.findBySchool(queryParamsWithPageDetails(req));
        return successResponseBuilder(data, meta);
    }

    @Roles(UserRole.superAdmin, UserRole.schoolManager, UserRole.student)
    @UseGuards(AuthGuard)
    @Get('/school/:id')
    public async getOne(@Param('id') id: string) {
        const response = await this.service.findById(id);
        return successResponseBuilder(response);
    }

    @Roles(UserRole.schoolManager)
    @UseGuards(AuthGuard)
    @Put('/school/:id')
    public async update(@Param('id') id: string, @Body() body: UpdateCalenderEventDTO) {

        const response = await this.service.update(id, body);
        return successResponseBuilder(response);
    }




    @Roles(UserRole.schoolManager)
    @UseGuards(AuthGuard)
    @Delete('/school/:id')
    public async deleteBlackboardSchool(@Param('id') id: string) {
        const deletedAcademicClass = await this.service.delete(id);
        return successResponseBuilder({});
    }
}

