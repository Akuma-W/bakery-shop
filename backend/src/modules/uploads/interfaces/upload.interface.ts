import 'multer';

export interface UploadedFileResponse {
  url: string;
  publicId: string;
  originalName: string;
  mimetype: string;
  size: number;
}
