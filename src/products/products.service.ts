import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { QueryProductDto } from './dtos/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(query: QueryProductDto): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { search, minPrice, maxPrice, sortBy, order, page = 1, limit = 10 } = query;

    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice ?? 0, maxPrice ?? Number.MAX_SAFE_INTEGER);
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      order: sortBy ? { [sortBy]: order ?? 'ASC' } : undefined,
      skip: (page - 1) * limit,
      take: limit,
      relations: { user: true, reviews: true },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: { user: true, reviews: true } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    const newProduct = this.productRepository.create({
      ...createProductDto,
      user: { id: userId } as User,
    });
    return await this.productRepository.save(newProduct);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
