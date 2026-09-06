// -Path: "Nest TypeScript/src/api/api.service.ts"
import {
    Scope,
    Logger,
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import type { Document } from 'mongoose';
import type { Auth } from '../types/auth';
import type { ApiMetaDto, ApiMetaSchema, ApiOutMetaSchema } from '../types/dto';

@Injectable({ scope: Scope.TRANSIENT })
export class ApiService<
    DataSchema extends ApiMetaSchema,
    DataDocument extends DataSchema & Document,
    DataCreate extends ApiMetaDto,
    DataResponse extends DataCreate,
    DataUpdate extends Partial<ApiMetaDto>,
> {
    private readonly logger = new Logger(ApiService.name);
    public response: (data: DataSchema) => Promise<DataResponse> = async (data) =>
        ({ ...data }) as unknown as DataResponse;
    constructor() {}

    async findAll(auth: Auth, datas: DataDocument[]): Promise<DataResponse[]> {
        const results = datas.filter((data) => data.userId === auth?.userId);
        return Promise.all(results.map((data) => this.response(data.toObject())));
    }

    async findOne(auth: Auth, data: DataDocument | null): Promise<DataResponse | null> {
        if (data?.userId !== auth?.userId) throw new BadRequestException('Unauthorized');
        if (data) return this.response(data.toObject());
        return null;
    }

    async create(
        auth: Auth,
        data: DataCreate,
        getNewData: (data: DataCreate) => ApiOutMetaSchema<DataSchema>,
    ): Promise<DataResponse> {
        if (auth === null) throw new UnauthorizedException('Unauthorized');
        if (
            (data.userId && auth.userId !== data.userId) ||
            (data.createdBy && auth.userId !== data.createdBy) ||
            (data.updatedBy && auth.userId !== data.updatedBy)
        )
            throw new BadRequestException('Unauthorized');
        const newData = getNewData(data);
        const result = {
            userId: auth.userId,
            createdBy: auth.userId,
            updatedBy: auth.userId,
            ...newData,
        } as DataSchema;
        return this.response(result);
    }

    async createMany(
        auth: Auth,
        datas: DataCreate[],
        getNewData: (data: DataCreate) => ApiOutMetaSchema<DataSchema>,
    ): Promise<DataResponse[]> {
        if (auth === null) throw new UnauthorizedException('Unauthorized');
        if (
            datas.find(
                (data) =>
                    (data.userId && data.userId !== auth.userId) ||
                    (data.createdBy && data.createdBy !== auth.userId) ||
                    (data.updatedBy && data.updatedBy !== auth.userId),
            )
        )
            throw new BadRequestException('Unauthorized');
        const newData = datas.map((data) => getNewData(data));
        const results = newData.map((data) => ({
            userId: auth.userId,
            createdBy: auth.userId,
            updatedBy: auth.userId,
            ...data,
        })) as DataSchema[];
        return Promise.all(results.map((data) => this.response(data)));
    }

    async update(
        auth: Auth,
        data: DataResponse | null,
        update: DataUpdate,
        getNewData: (data: DataUpdate) => Partial<ApiOutMetaSchema<DataSchema>>,
    ): Promise<DataResponse> {
        if (auth === null) throw new UnauthorizedException('Unauthorized');
        this.logger.log({
            userId: auth.userId,
            data,
            update,
        });
        if (auth.userId !== data?.userId) throw new BadRequestException('User ID is not match');
        if (auth.userId !== update.createdBy)
            throw new BadRequestException('Created By is not match');
        if (auth.userId !== update.updatedBy)
            throw new BadRequestException('Updated By is not match');
        const newData = getNewData(update);
        const updatedData = {
            updatedBy: auth.userId,
            ...newData,
        } as DataSchema;
        return this.response(updatedData);
    }

    async remove(auth: Auth, data: DataDocument | null): Promise<DataResponse> {
        if (auth === null) throw new UnauthorizedException('Unauthorized');
        if (data?.userId !== auth?.userId) throw new BadRequestException('Unauthorized');
        return this.response(data);
    }
}
