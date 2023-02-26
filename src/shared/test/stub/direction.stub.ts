import { DirectionType } from '../../../api/direction/model/direction.enum';
import { CreateDirectionDto } from '../../../api/direction/dto/create-direction.dto';

export const createDirection_1: CreateDirectionDto = {
  name: DirectionType.PHP,
  description: 'PHP lang',
};

export const createDirection_2: CreateDirectionDto = {
  name: DirectionType.ANGULAR,
  description: 'Angular framework',
};

export const createDirection_3: CreateDirectionDto = {
  name: DirectionType.REACT,
  description: 'React framework',
};

export const createDirection_4: CreateDirectionDto = {
  name: DirectionType.NET,
  description: '.Net platform',
};

export const createDirection_5: CreateDirectionDto = {
  name: DirectionType.JAVA,
  description: 'Java oracle lang',
};

export const directionsStub = [
  createDirection_1,
  createDirection_2,
  createDirection_3,
  createDirection_4,
  createDirection_5,
];

export const directionsStub2 = [
  createDirection_1,
  createDirection_2,
  createDirection_3,
];
