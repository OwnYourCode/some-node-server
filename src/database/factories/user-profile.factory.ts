import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { UserProfileEntity } from '../../api/user-profile/model/user-profile.entity';
import { Role } from '../../shared/enums/role.enum';
import { Gender } from '../../shared/enums/gender.enum';

define(UserProfileEntity, (faker: typeof Faker) => {
  const userProfileEntity = new UserProfileEntity();
  userProfileEntity.id = faker.random.uuid();
  userProfileEntity.firstName = faker.name.firstName();
  userProfileEntity.lastName = faker.name.lastName();
  userProfileEntity.education = `BSUIR`;
  userProfileEntity.address = `country: ${faker.address.country()}, city ${faker.address.city()}, street: ${faker.address.streetAddress()}`;
  userProfileEntity.birthDate = faker.date.past(25).toDateString();
  userProfileEntity.startDate = faker.date.recent(200).toDateString();
  userProfileEntity.universityAverageScore = 9.2;
  userProfileEntity.mathScore = 9.6;
  userProfileEntity.sex = Gender.MALE;
  userProfileEntity.skype = faker.internet.userName();
  userProfileEntity.email = 'senior.junior@gmail.com';
  userProfileEntity.mobilePhone = faker.phone.phoneNumber();
  userProfileEntity.password = 'qwe123123';
  userProfileEntity.roles = [Role.USER, Role.ADMIN, Role.MENTOR];
  return userProfileEntity;
});
