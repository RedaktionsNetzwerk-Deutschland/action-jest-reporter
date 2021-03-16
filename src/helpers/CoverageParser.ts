import { CoverageMapData, createCoverageMap, createCoverageSummary } from 'istanbul-lib-coverage';
import table from 'markdown-table';
import { File } from './File';

function getPctValue(input: { pct: number }): string {
  return `${input.pct.toString()}%`;
}

export class CoverageParser {
  private result: any;

  constructor(fileDir: string) {
    this.result = new File(fileDir).json;
  }

  get json(): string[][] {
    const summary = createCoverageSummary();
    const covMap = createCoverageMap(this.result.coverageMap as CoverageMapData);
    const rows = [['Filename', 'Statements', 'Branches', 'Functions', 'Lines']];

    covMap.files().forEach((file) => {
      const fileCov = covMap.fileCoverageFor(file);
      const fileCovSum = fileCov.toSummary();
      rows.push([
        file.replace(process.cwd(), ''),
        getPctValue(fileCovSum.statements),
        getPctValue(fileCovSum.branches),
        getPctValue(fileCovSum.functions),
        getPctValue(fileCovSum.lines),
      ]);
      summary.merge(fileCovSum);
    });

    rows.push([]);

    rows.push([
      'Overall Coverage',
      getPctValue(summary.statements),
      getPctValue(summary.branches),
      getPctValue(summary.functions),
      getPctValue(summary.lines),
    ]);

    return rows;
  }

  get table(): string {
    return table(this.json);
  }
}
