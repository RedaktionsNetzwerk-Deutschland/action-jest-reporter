export class File {
  public file: any;

  constructor(fileDir: string) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    this.file = require(fileDir);
  }

  public get json(): Record<any, any> {
    return this.file;
  }
}
