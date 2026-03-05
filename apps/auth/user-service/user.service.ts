import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../src/entities/users.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from '../src/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const { phone, password, firstName, lastName, pinfl, role } =
        createUserDto;

      // 1. Phone allaqachon mavjudligini tekshirish
      const existingUserByPhone = await this.findOneByPhone(phone, manager);
      if (existingUserByPhone) {
        throw new ConflictException('Bu phone allaqachon ro‘yxatdan o‘tgan');
      }
      const existingUserByPinfl = await this.existByPinfl(pinfl, manager);
      if (existingUserByPinfl) {
        throw new ConflictException('Bu pinfl allaqachon ro‘yxatdan o‘tgan');
      }

      // 2. Parolni hash qilish
      const hashedPassword = await this.hashPassword(password);

      // 3. Yangi user yaratish va saqlash
      const user = manager.create(User, {
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        pinfl: pinfl,
        isActive: true,
        role,
      });

      return manager.save(user);
    });
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  private getRepository(manager?: EntityManager): Repository<User> {
    return manager ? manager.getRepository(User) : this.userRepository;
  }

  public async findOneByPhone(phone: string, manager?: EntityManager) {
    const repository = this.getRepository(manager);
    return await repository.findOne({
      where: { phone },
    });
  }

  async findIdAndRoleByIdAndActive(numericUserId: number, active: boolean) {
    return await this.userRepository.findOne({
      where: { id: numericUserId, isActive: active },
      select: ['id', 'role'],
    });
  }

  private async existByPinfl(pinfl: string, manager: EntityManager) {
    return await manager.exists(User, {
      where: { pinfl },
    });
  }

  async findByPinfl(pinfl: string) {
    return await this.userRepository.findOne({
      where: { pinfl },
    });
  }
}
