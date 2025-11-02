"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const auth_module_1 = require("./modules/auth/auth.module");
const papers_module_1 = require("./modules/papers/papers.module");
const search_module_1 = require("./modules/search/search.module");
const citations_module_1 = require("./modules/citations/citations.module");
const authors_module_1 = require("./modules/authors/authors.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const users_module_1 = require("./modules/users/users.module");
const health_module_1 = require("./modules/health/health.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const paper_entity_1 = require("./modules/papers/entities/paper.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'scholar'),
                    password: configService.get('DB_PASSWORD', 'scholar_pass'),
                    database: configService.get('DB_NAME', 'omni_scholar'),
                    entities: [paper_entity_1.Paper],
                    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') !== 'production',
                    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            auth_module_1.AuthModule,
            papers_module_1.PapersModule,
            search_module_1.SearchModule,
            citations_module_1.CitationsModule,
            authors_module_1.AuthorsModule,
            analytics_module_1.AnalyticsModule,
            users_module_1.UsersModule,
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
