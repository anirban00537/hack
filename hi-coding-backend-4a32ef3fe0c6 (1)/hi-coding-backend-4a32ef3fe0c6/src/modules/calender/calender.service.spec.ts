
import { Test, TestingModule } from '@nestjs/testing';
import { CalenderService } from './calender.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calender } from '@/schemas/calender/calender';
import { CreateCalenderEventDTO, UpdateCalenderEventDTO } from './dto/calender.dto';
import { queryBuilder } from '@/utils/queryHelper';
import { paginationBuilder } from '@/utils/paginationBuilder';
import { Document } from 'mongoose';

describe('CalenderService', () => {
  let calenderService: CalenderService;
  let eventCalenderModel: Model<Calender, {}, {}, {}, Document<unknown, {}, Calender> & Omit<Calender & Required<{ _id: string; }>, never>, any>;
  const mockCreatedCalender = {
    _id: '611200bbca159502947d2f01',
    eventStart: "2023-05-23T14:23:00.000Z",
    eventEnd: "2023-05-23T18:23:00.000Z",
    eventId: "gb1245509988",
    eventTitle: "Math101 Lesson",
  };
  const mockUpdatedEvent: Calender = {
    _id: '611200bbca159502947d2f01',
    eventStart: "2023-05-23T14:23:00.000Z",
    eventEnd: "2023-05-23T18:23:00.000Z",
    eventId: "gb1245509988",
    eventTitle: "Math101 Lesson",
    // ...
  };
  const mockUpdateDTO: UpdateCalenderEventDTO = {

    eventStart: "2023-05-23T14:23:00.000Z",
    eventEnd: "2023-05-23T18:23:00.000Z",
    eventId: "gb1245509988",
    eventTitle: "Math101 Lesson@",

  };
  class MockCalender {
    constructor(private data) { }
    save = jest.fn().mockResolvedValue(this.data);
    static find = jest.fn().mockResolvedValue([mockCreatedCalender]);
    static create = jest.fn().mockResolvedValue(mockCreatedCalender);
    static findById = jest.fn().mockResolvedValue(mockCreatedCalender);
    static findByIdAndUpdate = jest.fn().mockResolvedValue(mockCreatedCalender);
    static findByIdAndDelete = jest.fn().mockResolvedValueOnce(mockCreatedCalender);
    static findByIdAndRemove = jest.fn().mockResolvedValueOnce(mockCreatedCalender);
    static deleteOne = jest.fn().mockResolvedValue(true);
    static findAll = async (query) => {
      const { page, pageSize } = query;
      const pipeline = queryBuilder(page, pageSize, 'calender', []);
      const [{ calender, total }] = await eventCalenderModel.aggregate(pipeline);
      return paginationBuilder(calender, total, page, pageSize);
    }
    static aggregate = ({ page, pageSize }) => Promise.resolve([{ total: pageSize, calender: [mockCreatedCalender] }]);//jest.fn().mockResolvedValue([])
    exec = jest.fn().mockResolvedValue([mockCreatedCalender])
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalenderService,
        {
          provide: getModelToken(Calender.name),
          useValue: MockCalender,
        },
      ],
    }).compile();

    calenderService = module.get<CalenderService>(CalenderService);
    eventCalenderModel = module.get<Model<Calender>>(getModelToken(Calender.name));
  });

  it('should be defined', () => {
    expect(calenderService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new calendar event', async () => {
      const createDTO: CreateCalenderEventDTO = {
        eventStart: "2023-05-23T14:23:00.000Z",
        eventEnd: "2023-05-23T18:23:00.000Z",
        eventId: "gb1245509988",
        eventTitle: "Math101 Lesson",

      };

      const result = await calenderService.create(mockCreatedCalender);
      expect(result).toEqual(mockCreatedCalender);
    });
  });

  describe('update', () => {


    it('should update a calender by id', async () => {


      const result = await calenderService.update('611200bbca159502947d2f01', mockUpdateDTO);
      expect(result).toEqual(mockUpdatedEvent);
    })

    it('should return null if an invalid id is provided', async () => {
      const result = await calenderService.update('invalid-id', mockUpdateDTO);
      expect(result).toBeNull();
    });

    it('should return null if the calender event is not found', async () => {
      (eventCalenderModel as any).findByIdAndUpdate.mockResolvedValueOnce(null);
      const result = await calenderService.update('611200bbca159502947d2f02', mockUpdateDTO);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of academic classes', async () => {
      const { data, meta } = await calenderService.findAll({
        page: 1,
        pageSize: 20
      });
      expect(data).toEqual([mockCreatedCalender]);
    });
  });

  describe('delete', () => {
    it('should delete an existing calendar event', async () => {
      const eventId = '611200bbca159502947d2f01';

      jest.spyOn(eventCalenderModel, 'findByIdAndDelete').mockResolvedValueOnce(true);

      const result = await calenderService.delete(eventId);

      expect(eventCalenderModel.findByIdAndDelete).toHaveBeenCalledWith(eventId);
      expect(result).toBeTruthy();
    });
  });
  describe('findById', () => {
    it('should return a calender event by id', async () => {
      const result = await calenderService.findById('611200bbca159502947d2f01');
      expect(result).toEqual(mockCreatedCalender);
    });

    it('should return null if an invalid id is provided', async () => {
      const result = await calenderService.findById('invalid-id');
      expect(result).toBeNull();
    });

    it('should return null if the calender is not found', async () => {
      (eventCalenderModel as any).findById.mockResolvedValueOnce(null);
      const result = await calenderService.findById('611200bbca159502947d2f02');
      expect(result).toBeNull();
    });
  });
});

