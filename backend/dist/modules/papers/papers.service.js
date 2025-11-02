"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PapersService = void 0;
const common_1 = require("@nestjs/common");
const papers_repository_1 = require("./papers.repository");
let PapersService = class PapersService {
    constructor(papersRepository) {
        this.papersRepository = papersRepository;
    }
    async create(createPaperDto) {
        return this.papersRepository.create(createPaperDto);
    }
    async findAll() {
        return this.papersRepository.findAll();
    }
    async findById(id) {
        const paper = await this.papersRepository.findById(id);
        if (!paper) {
            throw new common_1.NotFoundException(`Paper with ID ${id} not found`);
        }
        return paper;
    }
    async update(id, updatePaperDto) {
        await this.findById(id); // Verify exists
        return this.papersRepository.update(id, updatePaperDto);
    }
    async delete(id) {
        await this.findById(id); // Verify exists
        await this.papersRepository.delete(id);
    }
    async getStats() {
        const totalPapers = await this.papersRepository.count();
        return { totalPapers };
    }
};
exports.PapersService = PapersService;
exports.PapersService = PapersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [papers_repository_1.PapersRepository])
], PapersService);
