import { Body, Controller, Post } from '@nestjs/common';
import { P2pService } from './p2p.service';
import {
    ApproveOrderP2pDto,
    CancelOrderP2pDto,
    OrderP2pDto,
    P2pDto,
} from './dto/p2p.dto';

@Controller('p2p')
export class P2pController {
    constructor(private readonly p2pService: P2pService) {
        console.log('P2p Controller created');
    }

    @Post('create')
    async createP2p(@Body() body: P2pDto): Promise<any> {
        return await this.p2pService.createP2p(body);
    }

    @Post('order')
    async orderP2p(@Body() body: OrderP2pDto): Promise<any> {
        return await this.p2pService.orderP2p(body);
    }

    @Post('approve')
    async approveP2p(@Body() body: ApproveOrderP2pDto): Promise<any> {
        return await this.p2pService.approveP2p(body);
    }

    @Post('cancel')
    async cancelP2p(@Body() body: CancelOrderP2pDto): Promise<any> {
        return await this.p2pService.cancelP2p(body);
    }
}
