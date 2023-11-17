
import { Test, TestingModule } from '@nestjs/testing';
import { AcademicClassService } from './academic-class.service';
import { getModelToken } from '@nestjs/mongoose';
import { AcademicClass } from '@/schemas/academicClass/academicClass';
import { CreateAcademicClassDTO } from './dto/academic-class.dto';
import { UserService } from '../user/user.service';
import { paginationBuilder } from '@/utils/paginationBuilder';
import { queryBuilder } from '@/utils/queryHelper';

describe('AcademicClassService', () => {
  let service: AcademicClassService;
  let academicClassModel;


  const mockAcademicClass = {
    _id: '611200bbca159502947d2f01',
    name: 'Test Class',
    status: "active",
    school: "611200bbca159502947d2f035",
    description: 'A test class',
  };

  const mockCreatedAcademicClass = {

    name: 'Test Class',
    status: "active",
    school: "611200bbca159502947d2f035",
    description: 'A test class',
  };
  const mockCreateAcademicClassDto: CreateAcademicClassDTO = {

    name: 'Test Class',
    description: 'A test class',
    school: "611200bbca159502947d2f035",
    status: "active"
  };

  const mockUserService = {
    // mock user service methods if necessary
  };
  class MockAcademicClass {
    constructor(private data) { }
    save = jest.fn().mockResolvedValue(this.data);
    static find = jest.fn().mockResolvedValue([mockAcademicClass]);
    static create = jest.fn().mockResolvedValue(mockAcademicClass);
    static findById = jest.fn().mockResolvedValue(mockAcademicClass);
    static findByIdAndUpdate = jest.fn().mockResolvedValue(mockAcademicClass);
    static findByIdAndDelete = jest.fn().mockResolvedValueOnce(mockAcademicClass);
    static findByIdAndRemove = jest.fn().mockResolvedValueOnce(mockAcademicClass);
    static deleteOne = jest.fn().mockResolvedValue(true);
    static findAll = async (query) => {
      const { page, pageSize } = query;
      const pipeline = queryBuilder(page, pageSize, 'academicClass', []);
      const [{ academicClass, total }] = await academicClassModel.aggregate(pipeline);
      return paginationBuilder(academicClass, total, page, pageSize);
    }
    static aggregate = ({ page, pageSize }) => Promise.resolve([{ total: pageSize, academicClass: [mockAcademicClass] }]);//jest.fn().mockResolvedValue([])
    exec = jest.fn().mockResolvedValue([mockAcademicClass])
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademicClassService,
        UserService,
        {
          provide: getModelToken(AcademicClass.name),
          useValue: MockAcademicClass,
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    service = module.get<AcademicClassService>(AcademicClassService);
    academicClassModel = module.get(getModelToken(AcademicClass.name));
    // userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an academic class', async () => {
      const result = await service.create(mockCreateAcademicClassDto);
      expect(result).toEqual(mockCreatedAcademicClass);
    });
  });

  describe('findAll', () => {
    it('should return an array of academic classes', async () => {
      const { data, meta } = await service.findAll({
        page: 1,
        pageSize: 20
      });
      expect(data).toEqual([mockAcademicClass]);
    });
  });

  describe('findById', () => {
    it('should return an academic class by id', async () => {
      const result = await service.findById('611200bbca159502947d2f01');
      expect(result).toEqual(mockAcademicClass);
    });

    it('should return null if an invalid id is provided', async () => {
      const result = await service.findById('invalid-id');
      expect(result).toBeNull();
    });

    it('should return null if the academic class is not found', async () => {
      academicClassModel.findById.mockResolvedValueOnce(null);
      const result = await service.findById('611200bbca159502947d2f02');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an academic class by id', async () => {
      const result = await service.update('611200bbca159502947d2f01', mockCreateAcademicClassDto);
      expect(result).toEqual(mockAcademicClass);
    })

    it('should return null if an invalid id is provided', async () => {
      const result = await service.update('invalid-id', mockCreateAcademicClassDto);
      expect(result).toBeNull();
    });

    it('should return null if the academic class is not found', async () => {
      academicClassModel.findByIdAndUpdate.mockResolvedValueOnce(null);
      const result = await service.update('611200bbca159502947d2f02', mockCreateAcademicClassDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete an academic class by id', async () => {
      const result = await service.delete('611200bbca159502947d2f01');
      expect(result).toEqual(true);
    });

    it('should return false if an invalid id is provided', async () => {
      const result = await service.delete('invalid-id');
      expect(result).toEqual(false);
    });

    it('should return false if the academic class is not found', async () => {
      academicClassModel.findByIdAndRemove.mockResolvedValueOnce(null);
      const result = await service.delete('611200bbca159502947d2f0');
      expect(result).toEqual(false);
    });
  });
});
