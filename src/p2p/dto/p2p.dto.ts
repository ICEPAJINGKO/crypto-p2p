import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class P2pDto {
    @IsNotEmpty()
    @IsString()
    readonly walletId: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['btc', 'eth', 'xrp', 'doge', 'usdt'])
    readonly currency: string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;
}

export class OrderP2pDto {
    @IsNotEmpty()
    @IsString()
    readonly p2pId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;

    @IsNotEmpty()
    @IsString()
    readonly buyerWalletId: string;
}

export class ApproveOrderP2pDto {
    @IsNotEmpty()
    @IsString()
    readonly p2pTransactionId: string;
}

export class CancelOrderP2pDto {
    @IsNotEmpty()
    @IsString()
    readonly p2pTransactionId: string;
}
