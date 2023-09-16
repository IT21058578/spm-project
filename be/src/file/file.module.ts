import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { ConfigurableModuleClass } from './file.module-definition';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule extends ConfigurableModuleClass {}
