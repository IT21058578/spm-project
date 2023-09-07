import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { PDFService } from '@t00nday/nestjs-pdf';
import { ReportPurpose } from 'src/common/constants/report-purpose';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly pdfService: PDFService) {}

  async generateReport(purpose: ReportPurpose, data: any) {
    this.logger.log('Generating report...');
    const buffer = await firstValueFrom(
      this.pdfService.toBuffer(ReportPurpose[purpose].template, {
        locals: data,
      }),
    );
    return new StreamableFile(buffer);
  }
}
