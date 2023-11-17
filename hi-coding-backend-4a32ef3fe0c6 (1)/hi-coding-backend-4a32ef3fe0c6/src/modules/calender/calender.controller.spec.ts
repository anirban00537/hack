
import { Test, TestingModule } from '@nestjs/testing';
import { CalenderController } from './calender.controller';
import { CalenderService } from './calender.service';
import { CreateCalenderEventDTO, UpdateCalenderEventDTO } from './dto/calender.dto';
import { successResponseBuilder } from '@/utils/responseBuilder';
import { AuthGuard } from '@/guards/auth/auth.guard';
const mockCreatedCalender = {
  _id: '611200bbca159502947d2f01',
  eventStart: "2023-05-23T14:23:00.000Z",
  eventEnd: "2023-05-23T18:23:00.000Z",
  eventId: "gb1245509988",
  eventTitle: "Math101 Lesson",
};
describe('CalenderController', () => {
  let controller: CalenderController;
  let service: Partial<CalenderService> = {
    create: ({ eventStart, eventEnd, eventId, eventTitle }) => Promise.resolve({ eventStart, eventEnd, eventId, eventTitle } as any),
    findAll: () => Promise.resolve({ data: [], meta: { limit: 10, page: 1, total: 20, totalPages: 20 } }),
    delete: (id: string) => Promise.resolve(true)
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalenderController],
      providers: [
        { provide: CalenderService, useValue: service },
      ],
    }).overrideGuard(AuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<CalenderController>(CalenderController);
    service = module.get<CalenderService>(CalenderService);
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should create a new academic class', async () => {
      const createDto: CreateCalenderEventDTO = {

        eventStart: "2023-05-23T14:23:00.000Z",
        eventEnd: "2023-05-23T18:23:00.000Z",
        eventId: "gb1245509988",
        eventTitle: "Math101 Lesson",
      };

      const expectedResponse = mockCreatedCalender; // provide the expected response

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

      const expectedData = [mockCreatedCalender]; // provide the expected data
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

      const expectedResponse = mockCreatedCalender; // provide the expected response

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
      const updateDto: UpdateCalenderEventDTO = {
        // provide the necessary properties for the update DTO
        eventStart: "2023-05-23T14:23:00.000Z",
        eventEnd: "2023-05-23T18:23:00.000Z",
        eventId: "gb1245509988",
        eventTitle: "Math101 Lesson",
      };

      const expectedResponse = mockCreatedCalender; // provide the expected response

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
