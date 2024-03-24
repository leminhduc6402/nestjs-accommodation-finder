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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from './users.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Create a new user' })
    @Post()
    @ResponseMessage('Create a new user')
    create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
        return this.usersService.create(createUserDto);
    }

    @ApiQuery({ name: 'fullName', required: false, example: '/Lê/i' })
    @ApiQuery({ name: 'email', required: false, example: '/le/i' })
    @ApiQuery({ name: 'phone', required: false })
    @ApiOperation({ summary: 'Get all user with pagination' })
    @ResponseMessage('fetch user with pagination')
    @Get()
    findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return this.usersService.findAll(+currentPage, +limit, qs);
    }

    @Public()
    @ApiOperation({ summary: 'Get user by id' })
    @ResponseMessage('Get a user')
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id);
    }

    @ApiOperation({
        summary:
            'Update a user - when use this api to update user, please using CreateUser body',
    })
    @ResponseMessage('Update a user')
    @Patch()
    update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
        return this.usersService.update(updateUserDto, user);
    }

    @ApiOperation({ summary: 'Remove a user' })
    @ResponseMessage('Delete a user')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.usersService.remove(id, user);
    }
}
