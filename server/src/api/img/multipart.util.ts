import type { FastifyRequest } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';
import type { MulterFile } from '../../types/multer';

// @fastify/multipart attaches file parts into req.body when attachFieldsToBody is enabled.
export function getMultipartFile(req: FastifyRequest, field: string): MultipartFile | undefined {
    const value = (req.body as Record<string, unknown> | undefined)?.[field];
    if (Array.isArray(value)) return value[0] as MultipartFile;
    return value as MultipartFile | undefined;
}

export async function toMulterFile(file: MultipartFile): Promise<MulterFile> {
    const buffer = await file.toBuffer();
    return {
        fieldname: file.fieldname,
        originalname: file.filename,
        encoding: file.encoding || '7bit',
        mimetype: file.mimetype,
        size: buffer.length,
        buffer: buffer,
        destination: '',
        filename: file.filename,
        path: '',
    };
}
