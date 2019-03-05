import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideostreamController } from './controllers/videostream.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, VideostreamController],
  providers: [AppService],
})
export class AppModule {}
