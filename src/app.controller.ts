import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Counter, Histogram } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectMetric("http_request_count_total") public counter: Counter<string>,
    @InjectMetric("http_request_duration_seconds") public histogram: Histogram<string>) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("increase")
  increase(): void {
    this.counter.inc()
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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
}
