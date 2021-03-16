import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import glob from 'glob';
import path from 'path';
import { Annotations } from '../types/types';
import { AssertionParser } from './AssertionParser';
import { CoverageParser } from './CoverageParser';

function getHeadSHA(): string {
  if (context.payload.pull_request) {
    return context.payload.pull_request.head.sha;
  }

  return context.sha;
}

export class FileProcessor {
  private readonly files: string[] = [];

  private readonly octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN || core.getInput('GITHUB_TOKEN');
    if (!token) core.setFailed('GITHUB_TOKEN is not defined.');
    this.octokit = getOctokit(token);
    const matcher = core.getInput('json-glob') || '**/jest-output.json';
    const workdir = core.getInput('workdir') || process.env.GITHUB_WORKSPACE || '.';
    this.files = glob
      .sync(matcher, {
        cwd: workdir,
        dot: true,
      })
      .filter((file) => !file.includes('node_modules'))
      .map((file) => path.resolve(process.cwd(), file));
  }

  public async process(): Promise<void> {
    core.info(`Found ${this.files.length} files matching the glob.`);
    core.info(this.files.join(', '));
    const coverages = this.files.map((file) => new CoverageParser(file).table);
    const assertionsArray = this.files.map((file) => new AssertionParser(file));
    const annotations: Annotations[] = [];
    assertionsArray.forEach((assertion) => {
      assertion.generateAnnotations.forEach((annotation) => annotations.push(annotation));
    });
    core.info('Creating coverage report...');
    await this.octokit.checks.create({
      repo: context.repo.repo,
      owner: context.repo.owner,
      name: 'Coverage',
      head_sha: getHeadSHA(),
      status: 'completed',
      conclusion: 'success',
      output: {
        title: 'Coverage',
        summary: `I've found ${coverages.length} coverage reports`,
        text: coverages.join('\n\n'),
      },
    });
    if (annotations.length !== 0) {
      core.info('Creating Test Result Report');
      console.log(annotations);
      await this.octokit.checks.create({
        repo: context.repo.repo,
        owner: context.repo.owner,
        name: 'Test Results',
        head_sha: getHeadSHA(),
        status: 'completed',
        conclusion: 'success',
        output: {
          title: 'Test Results',
          summary: 'Some tests were not successful.',
          annotations,
        },
      });
    } else {
      core.info('No Tests failed. Not creating a report.');
    }
  }
}
