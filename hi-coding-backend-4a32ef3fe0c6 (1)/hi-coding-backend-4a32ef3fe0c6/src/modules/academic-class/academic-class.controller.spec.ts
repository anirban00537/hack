
import { Test, TestingModule } from '@nestjs/testing';
import { AcademicClassController } from './academic-class.controller';
import { AcademicClassService } from './academic-class.service';
import { CreateAcademicClassDTO, UpdateAcademicClassDTO } from './dto/academic-class.dto';
import { successResponseBuilder } from '@/utils/responseBuilder';
import { AuthGuard } from '@/guards/auth/auth.guard';
const mockAcademicClass = {
  _id: '611200bbca159502947d2f01',
  name: 'Test Class',
  status: "active",
  school: "611200bbca159502947d2f035",
  description: 'A test class',
};
describe('AcademicClassController', () => {
  let controller: AcademicClassController;
  let service: Partial<AcademicClassService> = {
    create: ({ name, school, status }) => Promise.resolve({ name, school, status } as any),
    findAll: () => Promise.resolve({ data: [], meta: { limit: 10, page: 1, total: 20, totalPages: 20 } }),
    delete: (id: string) => Promise.resolve(true)
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicClassController],
      providers: [
        { provide: AcademicClassService, useValue: service },
      ],
    }).overrideGuard(AuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<AcademicClassController>(AcademicClassController);
    service = module.get<AcademicClassService>(AcademicClassService);
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should create a new academic class', async () => {
      const createDto: CreateAcademicClassDTO = {

        name: 'Test Class',
        description: 'A test class',
        school: "611200bbca159502947d2f035",
        status: "active"
      };

      const expectedResponse = mockAcademicClass; // provide the expected response

      //jest.spyOn(service, 'create').mockResolvedValue(expectedResponse);
      service.create = jest.fn().mockImplementation(() => Promise.resolve(expectedResponse))

      const response = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(response).toEqual(successResponseBuilder(expectedResponse));
    });
  });

  describe('findAll', () => {
    it('should get all academic classes', async () => {
      const req = { query: { pageSize: 10, page: 1 } }; // provide a mock request object

      const expectedData = [mockAcademicClass]; // provide the expected data
      const expectedMeta = { limit: 1, page: 1, total: 20, totalPages: 20 }; // provide the expected meta

      jest.spyOn(service, 'findAll').mockResolvedValue({ data: expectedData, meta: expectedMeta });

      const response = await controller.findAll(req);

      expect(service.findAll).toHaveBeenCalledWith(req.query);
      expect(response).toEqual(successResponseBuilder(expectedData, expectedMeta));
    });
  });

  describe('getOne', () => {
    it('should get an academic class by ID', async () => {
      const id = '611200bbca159502947d2f01'; // provide an example ID

      const expectedResponse = mockAcademicClass; // provide the expected response

      //jest.spyOn(service, 'findById').mockResolvedValue(expectedResponse);
      service.findById = jest.fn().mockImplementation(() => Promise.resolve(expectedResponse))

      const response = await controller.getOne(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(response).toEqual(successResponseBuilder(expectedResponse));
    });
  });

  describe('update', () => {
    it('should update an academic class', async () => {
      const id = '611200bbca159502947d2f01'; // provide an example ID
      const updateDto: UpdateAcademicClassDTO = {
        // provide the necessary properties for the update DTO
        name: 'Test Class',
        description: 'A test class',
        school: "611200bbca159502947d2f035",
        status: "active"
      };

      const expectedResponse = mockAcademicClass; // provide the expected response

      //jest.spyOn(service, 'update').mockResolvedValue(expectedResponse);
      service.update = jest.fn().mockImplementation(() => Promise.resolve(expectedResponse))
      const response = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(response).toEqual(successResponseBuilder(expectedResponse));
    });
  });

  describe('deleteBlackboardSchool', () => {
    it('should delete an academic class', async () => {
      const id = '611200bbca159502947d2f01'; // provide an example ID

      jest.spyOn(service, 'delete').mockResolvedValue(true);

      const response = await controller.deleteBlackboardSchool(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(response).toEqual(successResponseBuilder({}));
    });
  });
});
