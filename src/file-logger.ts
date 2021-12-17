import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

// export default class Logger {
//     static error = (errorType: any, message: string) => {
//         if (!existsSync('log/root')) {
//             mkdirSync('log/root', { recursive: true })
//         }
//         const date = new Date()
//         const pathLog = join(`log/root/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-root.log`)
//         const dataLog = `[ERROR] [${errorType.toUpperCase()}] ${message}`
//         writeFileSync(pathLog, dataLog + '\r\n', { flag: "a" })
//     }
// }

import { ConsoleLogger, Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class FileLogger extends ConsoleLogger {
    error(error: Error, stack?: string, context?: string) {
        // console.log("message", message.message)
        // console.log("stack", message.stack)
        // console.log("name", message.name)
        if (!existsSync('log/root')) {
            mkdirSync('log/root', { recursive: true })
        }
        const date = new Date()
        const pathLog = join(`log/root/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-root.log`)
        const dataLog = `[ERROR] [MESSAGE] ${error.message} [STACK] ${error.stack}`
        writeFileSync(pathLog, dataLog + '\r\n', { flag: "a" })
    }
}