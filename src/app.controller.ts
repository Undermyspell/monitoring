import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Counter, Histogram } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { FileLogger } from './file-logger';
import { readFileSync } from 'fs';

@Controller()
export class AppController {

  deviceIds: string[] = ['mk-test-123', 'cp-iot-555']

  constructor(
    private readonly appService: AppService,
    private readonly logger: FileLogger,
    @InjectMetric("http_request_count_total") public counter: Counter<string>,
    @InjectMetric("http_request_duration_seconds") public histogram: Histogram<string>) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("increase")
  increase(): void {
    const random = this.getRandomInt(0, 2)
    const deviceId = this.deviceIds[random];
    this.counter.labels({ "device_Id": deviceId }).inc()
  }

  @Get("longRunning")
  longRunning(): void {
    const start = new Date();
    const random = this.getRandomInt(0, 20) * 1000

    setTimeout(() => {
      const end = new Date().getTime() - start.getTime();
      this.histogram.observe(end / 1000)
    }, random)

    this.counter.inc()
  }

  @Get("error")
  error(): void {
    try {
      readFileSync('./not_found.txt')
    } catch (error) {
      this.logger.error(error)
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
}
