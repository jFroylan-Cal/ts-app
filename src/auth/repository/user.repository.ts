import { UserOrmEntity } from "../entities/user.orm.entity";

export interface UserRepository {
    create(user: Partial<UserOrmEntity>): Promise<UserOrmEntity>;
    update(id: string, user: Partial<UserOrmEntity>): Promise<UserOrmEntity>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<UserOrmEntity>;
    findByEmail(email: string): Promise<UserOrmEntity | null>;
}