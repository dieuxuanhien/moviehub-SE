import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma.service';
import { BookingRedisModule } from '../redis/redis.module';
import { NotificationModule } from '../notification/notification.module';
import { TicketModule } from '../ticket/ticket.module';
import { SERVICE_NAME } from '@movie-hub/shared-types';

@Module({
  imports: [
    BookingRedisModule,
    NotificationModule,
    TicketModule,
    ClientsModule.register([
      {
        name: SERVICE_NAME.USER,
        transport: Transport.TCP,
        options: {
          host: process.env.USER_HOST || 'localhost',
          port: parseInt(process.env.USER_PORT) || 3001,
        },
      },
      {
        name: SERVICE_NAME.CINEMA,
        transport: Transport.TCP,
        options: {
          host: process.env.CINEMA_HOST || 'localhost',
          port: parseInt(process.env.CINEMA_PORT) || 3002,
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
  exports: [PaymentService],
})
export class PaymentModule {}
