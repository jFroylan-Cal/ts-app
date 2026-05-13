import { UserOrmEntity } from "../entities/auth.entity";

export interface UserRepository { 
    create(user: Partial<UserOrmEntity>): Promise<UserOrmEntity>;
    update(id: string, user: Partial<UserOrmEntity>): Promise<UserOrmEntity>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<UserOrmEntity>;
}