import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(): {
    id: number;
    name: string;
    email: string;
  }[] {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      {
        id: 3,
        name: 'Michael Brown',
        email: 'michael@example.com',
      },
    ];
  }
}