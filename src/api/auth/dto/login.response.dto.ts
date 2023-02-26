import { ApiProperty } from '@nestjs/swagger';

export interface ILoginResponse {
  token: string;
}

export class LoginResponse implements ILoginResponse {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlbmlvci5qdW5pb3JAZ21haWwuY29tIiwidXNlcklkIjoiZmFmNTk3OGEtMzAyYS00ZDcyLWJjM2UtNmM4ZmZhOGYwMzRjIiwiaWF0IjoxNjUyMjA4NzE0LCJleHAiOjE2NTIyOTUxMTR9.z53vXuPtnlwex1Hdb66AJbJKlcu-9ZId5ZxAOWWx5vQ',
  })
  token: string;
}
