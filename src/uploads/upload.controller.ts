import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    const dir = join(process.cwd(), 'uploads');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('upload')
export class UploadController {
  @Post('')
  @UseInterceptors(FileInterceptor('file', { storage }))
  public uploadFile(@UploadedFile() file: Express.Multer.File): { url: string } {
    return { url: `/uploads/${file.filename}` };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('file', 10, { storage }))
  public uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]): { urls: string[] } {
    const urls = files.map(file => `/uploads/${file.filename}`);
    return { urls };
  }
}
