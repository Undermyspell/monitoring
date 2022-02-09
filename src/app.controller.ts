import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Counter, Gauge, Histogram } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { FileLogger } from './file-logger';
import { readFileSync } from 'fs';

@Controller()
export class AppController {

  deviceIds: string[] = ['mk-test-123', 'cp-iot-555']
  ramValues: number[] = [23.44, 35.2, 58.12, 78.99, 93.27]
  tempValue: number[] = [30.33, 41.37, 56.88, 70.34, 79.34]

  constructor(
    private readonly appService: AppService,
    private readonly logger: FileLogger,
    @InjectMetric("http_request_count_total") public counter: Counter<string>,
    @InjectMetric("http_request_duration_seconds") public histogram: Histogram<string>,
    @InjectMetric("device_cpu_temperature") public tempGauge: Gauge<string>,
    @InjectMetric("device_ram_usage") public ramGauge: Gauge<string>
  ) { }

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


  @Get("temp")
  temp(): void {
    const random = this.getRandomInt(0, 2)
    const randomValue = this.getRandomInt(0, 6)
    const deviceId = this.deviceIds[random];
    this.tempGauge.labels({ "device_Id": deviceId }).set(this.tempValue[randomValue])
  }


  @Get("ram")
  ram(): void {
    const random = this.getRandomInt(0, 2)
    const randomValue = this.getRandomInt(0, 6)
    const deviceId = this.deviceIds[random];
    this.ramGauge.labels({ "device_Id": deviceId }).set(this.ramValues[randomValue])
  }

  @Get("longRunning")
  longRunning(): void {
    const start = new Date();
    const random = this.getRandomInt(0, 20) * 1000
    const randomDevice = this.getRandomInt(0, 2)
    const deviceId = this.deviceIds[randomDevice];
    setTimeout(() => {
      const end = new Date().getTime() - start.getTime();
      this.histogram.labels({ "device_Id": deviceId }).observe(end / 1000)
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
