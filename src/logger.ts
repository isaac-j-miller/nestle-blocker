import chalk from "chalk";

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}
const LogLevels = ["debug", "info", "warn", "error"] as const;
const colorLevels = [
  chalk.green,
  chalk.magenta,
  chalk.yellow,
  chalk.red,
] as const;
export class Logger {
  public static level: LogLevel = LogLevel.DEBUG;
  constructor(private source: string) {}
  private log(level: LogLevel, msgs: unknown[]) {
    if (level < Logger.level) {
      return;
    }
    const stringLogLevel = LogLevels[level];
    const color = colorLevels[level];
    console[stringLogLevel](
      color(
        `${new Date().toISOString()} ${stringLogLevel.toUpperCase()} [${
          this.source
        }]\t`
      ),
      ...msgs
    );
  }
  debug(...msgs: unknown[]) {
    this.log(LogLevel.DEBUG, msgs);
  }
  info(...msgs: unknown[]) {
    this.log(LogLevel.INFO, msgs);
  }
  warn(...msgs: unknown[]) {
    this.log(LogLevel.WARN, msgs);
  }
  error(...msgs: unknown[]) {
    this.log(LogLevel.ERROR, msgs);
  }
}
