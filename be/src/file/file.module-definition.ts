import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FirebaseOptions } from 'firebase/app';

export type FileModuleOptions = FirebaseOptions;

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FileModuleOptions>()
    .setClassMethodName('forRoot')
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
