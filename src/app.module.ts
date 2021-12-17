import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider, makeGaugeProvider } from "@willsoto/nestjs-prometheus";
import { FileLogger } from './file-logger';

@Module({
  imports: [PrometheusModule.register()],
  controllers: [AppController],
  providers: [
    AppService,
    FileLogger,
    makeCounterProvider({
      name: "http_request_count_total",
      help: "Count of all requests",
    }),
    makeHistogramProvider({
      name: "http_request_duration_seconds",
      help: "Duration of request in separate buckets",
      buckets: [1, 2, 5, 10, 20]
    })],
})
export class AppModule { }
