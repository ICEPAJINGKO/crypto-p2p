import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly walletService: WalletService,
    ) {
        console.log('User Service created');
    }

    async register(data: RegisterDto): Promise<RegisterDto> {
        const dataToSave = {
            ...data,
            password: await this.encryptHash(data.password),
        };
        const user = new this.userModel(dataToSave);

        const saved = await user.save();

        if (saved) {
            const created = await this.walletService.createWallet({
                user_id: String(saved._id),
            });
        }

        return user.save();
    }

    async encryptHash(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    async compareHash(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
}
