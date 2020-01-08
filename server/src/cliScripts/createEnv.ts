import chalk from 'chalk';
import inquirer from 'inquirer';
import uuid from 'uuid/v4';
import * as fs from 'fs';

export default function main(): Promise<void> {
  return inquirer.prompt([
    {
      name: 'domain',
      message: chalk.blue('Enter your domain: '),
    },
    {
      name: 'analyticsTable',
      message: chalk.blue('Analytics table name: '),
      default: 'analyticsTable',
    },
    {
      name: 'userTable',
      message: chalk.blue('User table name: '),
      default: 'userTable'
    },
    {
      name: 'region',
      message: chalk.blue('Enter AWS region: '),
      default: 'us-west-2',
    },
  ]).then(answers => {
    const domain = `MY_DOMAIN=${answers.domain}\n`;
    const analyticsTable = `DYNAMODB_TABLE=${answers.analyticsTable}\n`;
    const userTable = `USER_TABLE=${answers.userTable}\n`;
    const region = `REGION=${answers.region}\n`;
    const prodEnv = `JWT_SECRET=${uuid()}\n`;
  
    const variables = domain + analyticsTable + userTable + region + prodEnv;
    const devEnv = 'IS_OFFLINE=true\nLOCAL_DB_ENDPOINT=http://localhost:8000\n';
  
    fs.writeFile('.env', variables + devEnv, (err) => {
      if (err) {
        throw err;
      }
    });
    fs.writeFile('.env.production', variables, (err) => {
      if (err) {
        throw err;
      }
    });
  }).catch(console.error);
}
