// -Path: "Nest TypeScript/src/api/img/img.module.ts"
import { Module } from '@nestjs/common';
import { ImgService } from './img.service';
import { ApiService } from '../api.service';
import { PassportModule } from '@nestjs/passport';
import { ImgController } from './img.controller';
import { ImportsMongoose } from '../../hooks/mongodb';
import { Image, ImageSchema } from './schemas/image.schema';

@Module({
    controllers: [ImgController],
    providers: [ApiService, ImgService],
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ...new ImportsMongoose({ name: Image.name, schema: ImageSchema }).imports,
    ],
})
export class ImgModule {}
