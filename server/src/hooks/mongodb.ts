// -Path: "Nest TypeScript/src/hooks/mongodb.ts"
import { SecureService } from '../secure/secure.service';
import { type ModelDefinition, MongooseModule } from '@nestjs/mongoose';

export const nameDB = 'database';

export class ImportsMongoose {
    dbName?: string = nameDB;
    private models: ModelDefinition[];
    constructor(...models: ModelDefinition[]) {
        this.models = models;
    }
    setName(name: string) {
        this.dbName = name;
        return this;
    }
    get imports() {
        return [
            MongooseModule.forRootAsync({
                connectionName: this.dbName,
                inject: [SecureService],
                useFactory: async (secureService: SecureService) => ({
                    dbName: this.dbName,
                    minPoolSize: 2,
                    maxPoolSize: 10,
                    retryDelay: 3000,
                    retryAttempts: 3,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 10000,
                    uri: secureService.getEnvConfig().MONGODB_URI,
                    ...(!secureService.isDev() && {
                        ssl: true,
                        tlsAllowInvalidCertificates: false,
                    }),
                }),
            }),
            MongooseModule.forFeature(this.models, this.dbName),
        ];
    }
}
