import { Test, TestingModule } from '@nestjs/testing';
import { WorksmobileAttendanceService } from './worksmobile-attendance.service';

describe('WorksmobileAttendanceService', () => {
  let service: WorksmobileAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorksmobileAttendanceService],
    }).compile();

    service = module.get<WorksmobileAttendanceService>(
      WorksmobileAttendanceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
