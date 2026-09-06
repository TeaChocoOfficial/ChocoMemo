// -Path: "Nest TypeScript/src/api/user/user.controller.ts"
import { UserService } from './user.service';
import { ResponseUserDto } from './dto/response-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';

@ApiTags('API Users')
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiResponse({
        status: 200,
        type: [ResponseUserDto],
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: [ResponseUserDto],
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Get all users',
        description: 'Get all users',
    })
    findAll(): Promise<(ResponseUserDto | null)[]> {
        return this.userService.findAll();
    }

    @Get('id/:id')
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Get user by ID',
        description: 'Get user by ID',
    })
    async findOneById(@Param('id') id: string) {
        const user = await this.userService.findUser(id);
        if (user === null) throw new NotFoundException(`User with ID ${id} not found.`);
        return user;
    }

    @Post()
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Create user',
        description: 'Create user',
    })
    async create(@Body() body: CreateUserDto) {
        return this.userService.create(body);
    }

    @Put('id/:id')
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Update user by ID',
        description: 'Update user by ID',
    })
    async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(id, body);
    }

    @Delete('id/:id')
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Delete user by ID',
        description: 'Delete user by ID',
    })
    async remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
