import { Factory, Seeder } from 'typeorm-seeding';
import { UserProfileEntity } from '../../api/user-profile/model/user-profile.entity';
import { Connection } from 'typeorm';

export default class UserProfiles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const directions = await connection.query('SELECT * FROM DIRECTION');
    console.log('directions', directions);
    const user = await factory(UserProfileEntity)().create();
    // user.direction = directions[0];
    await connection.query('UPDATE "userProfile" upf SET "directionId" = $1 WHERE upf.id = $2', [
      directions[0].id,
      user.id,
    ]);
  }
}
