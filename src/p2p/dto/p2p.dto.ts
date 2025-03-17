import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class P2pDto {
    @IsNotEmpty()
    @IsString()
    readonly walletId: string;

    @IsNotEmpty()
    @IsString()
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
    readonly walletId: string;

    @IsNotEmpty()
    @IsString()
    readonly currency: string;

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;
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
