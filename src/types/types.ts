/* eslint-disable camelcase */
export type TestStats = {
  failedTests: number;
  passedTests: number;
  totalTests: number;
  success: boolean;
};

export type Annotations = {
  path: string;
  start_line: number;
  end_line: number;
  start_column?: number;
  end_column?: number;
  annotation_level: 'notice' | 'warning' | 'failure';
  message: string;
  title?: string;
  raw_details?: string;
};

export type Assertion = {
  stats: TestStats;
  annotations: Annotations[];
};
