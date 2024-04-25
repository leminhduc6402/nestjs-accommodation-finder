import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @ApiOperation({ summary: 'Create a new role' })
    @ResponseMessage('Create a new role')
    @Post()
    create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
        return this.rolesService.create(createRoleDto, user);
    }

    @ApiOperation({ summary: 'Fetch all role with paginate' })
    @ResponseMessage('Fetch all role with paginate')
    @Get()
    findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return this.rolesService.findAll(+currentPage, +limit, qs);
    }

    @Public()
    @ApiOperation({ summary: 'Fetch role by id' })
    @ResponseMessage('Fetch role by id')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a role' })
    @ResponseMessage('Update a role')
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
        @User() user: IUser,
    ) {
        return this.rolesService.update(id, updateRoleDto, user);
    }

    @ApiOperation({ summary: 'Delete a role by id' })
    @ResponseMessage('Delete a role by id')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.rolesService.remove(id, user);
    }
}
