import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { initializeApp } from 'firebase/app';
import {
  FirebaseStorage,
  UploadMetadata,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { DocumentType } from 'src/common/constants/document-types';
import ErrorMessage from 'src/common/constants/error-message';
import { v4 as uuid } from 'uuid';
import {
  FileModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './file.module-definition';

@Injectable()
export class FileService {
  private readonly uuidVersion = 4;
  private readonly logger = new Logger(FileService.name);
  private readonly firebaseStorage: FirebaseStorage;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: FileModuleOptions,
  ) {
    const app = initializeApp(this.options);
    this.firebaseStorage = getStorage(app);
  }

  async uploadFile(type: DocumentType, file: Express.Multer.File) {
    this.logger.log(`Attempting to upload a new ${type} file...`);
    const path = `${type}/${uuid()}.file`;
    const reference = ref(this.firebaseStorage, path);
    const metadata: UploadMetadata = {
      contentType: file.mimetype,
    };

    try {
      const uploadResult = await uploadBytes(reference, file.buffer, metadata);
      this.logger.log(`Succesfully uploaded new ${type} file`);
      return uploadResult;
    } catch (error) {
      this.handleFirebaseError(error);
    }
  }

  async downloadFile(path: string) {
    if (this.validateDocumentPath(path)) {
      this.logger.warn(
        `Attempted to download file with invalid path '${path}'`,
      );
      throw new BadRequestException(ErrorMessage.INVALID_FILE_NAME);
    }

    try {
      this.logger.log(`Attempting to download file at path '${path}'`);
      const reference = ref(this.firebaseStorage, path);
      const url = await getDownloadURL(reference);
      this.logger.log(
        `Successfully got download url for file at path '${path}'`,
      );
      return url;
    } catch (error) {
      this.handleFirebaseError(error);
    }
  }

  async deleteFile(path: string) {
    if (this.validateDocumentPath(path)) {
      this.logger.warn(`Attempted to delete file with invalid path '${path}'`);
      throw new BadRequestException(ErrorMessage.INVALID_FILE_NAME);
    }

    try {
      this.logger.log(`Attempting to delete file at path '${path}'`);
      const reference = ref(this.firebaseStorage, path);
      await deleteObject(reference);
      this.logger.log(`Successfully got deleted file at path '${path}'`);
    } catch (error) {
      this.handleFirebaseError(error);
    }
  }

  private validateDocumentPath(path: string) {
    const isValidDocumentType = Object.values(DocumentType).some((type) =>
      path.startsWith(type),
    );
    if (isValidDocumentType) {
      const isValidFilename = isUUID(
        path.split('/').pop()?.split('.')?.at(0),
        this.uuidVersion,
      );
      return isValidFilename;
    }
    return false;
  }

  private handleFirebaseError(error: { code: string }) {
    const errorCode = error?.code as string;
    this.logger.warn(
      `An error occurred when trying to process file '${errorCode}'`,
    );
    switch (errorCode) {
      // TODO: Granularly handle errors
      case StorageError.OBJECT_NOT_FOUND:
        throw new BadRequestException(ErrorMessage.FILE_NOT_FOUND);
      case StorageError.UNAUTHORIZED:
      case StorageError.UNAUTHENTICATED:
        throw new UnauthorizedException();
      case StorageError.UNKNOWN:
        throw new InternalServerErrorException(error);
      default:
        this.logger.error(error);
        throw new Error();
    }
  }
}
