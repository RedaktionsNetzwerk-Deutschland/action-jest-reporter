import stripAnsi from 'strip-ansi';
import { Annotations, TestStats } from '../types/types';
import { File } from './File';

export class AssertionParser {
  private result: any;

  constructor(fileDir: string) {
    this.result = new File(fileDir).json;
  }

  get testStats(): TestStats {
    return {
      failedTests: this.result.numFailedTests,
      passedTests: this.result.numPassedTests,
      totalTests: this.result.numTotalTests,
      success: this.result.success,
    };
  }

  private prettifyFailure(failureMessage: string[]): string {
    const msg: string[] = [];
    const errorTitle = failureMessage[0];
    const expected = failureMessage[2];
    const received = failureMessage[3];
    msg.push(errorTitle, expected, received);
    failureMessage.forEach((line) => {
      if (!(line.includes('node_modules') || line.includes('node:internal')) && line.trim().startsWith('at')) {
        msg.push(line);
      }
    });
    return stripAnsi(msg.join('\n'));
  }

  get generateAnnotations(): Annotations[] {
    const annotations: Annotations[] = [];
    this.result.testResults.forEach((testResult: any) => {
      testResult.assertionResults.forEach((assertionResult: any) => {
        if (assertionResult.status === 'failed') {
          annotations.push({
            path: testResult.name.replace(process.cwd(), ''),
            start_line: assertionResult.location.line,
            end_line: assertionResult.location.line,
            annotation_level: 'failure',
            title: `The test "${assertionResult.title}" failed`,
            message: this.prettifyFailure(assertionResult.failureMessages),
          });
        }
      });
    });
    return annotations;
  }
}
