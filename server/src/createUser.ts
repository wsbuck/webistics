import AWS from 'aws-sdk';
import clear from 'clear';
import bcrypt from 'bcrypt';
import chalk from 'chalk';
import readline from 'readline';
import * as figlet from 'figlet';
import * as dotenv from 'dotenv';

dotenv.config();


// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUsername(): Promise<string> {
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  return new Promise((resolve) => {
    rl.question(chalk.blue('Enter a username: '), (input: string) => {
      resolve(input);
    });
  });
}

function getPassword(): Promise<string> {
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  return new Promise((resolve) => {
    rl.question(chalk.blue('Enter a password: '), (input: string) => {
      resolve(input);
    });
  });
}

async function getInputs(): Promise<Array<string>> {
  const username = await getUsername();
  const password1 = await getPassword();
  console.log(chalk.greenBright('Please repeat your password'));
  const password2 = await getPassword();
  if (password1 !== password2) {
    throw new Error('Password\'s do not match!');
  }
  return [username, password1];
}

async function main(): Promise<void> {
  const USER_TABLE = process.env.USER_TABLE;
  const REGION = process.env.REGION;
  
  const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: REGION,
  });

  clear();
  console.log(
    chalk.greenBright(
      figlet.textSync('WEBISTICS', {
        font: 'Basic',
        horizontalLayout: 'full',
      })
    )
  );

  try {
    const [username, password] = await getInputs();
    const hash = bcrypt.hashSync(password, 10);

    const params = {
      TableName: USER_TABLE,
      Item: {
        username: username,
        password: hash,
      },
    };

    dynamoDb.put(params, (error) => {
      if (error) {
        throw new Error('Could not save to Database');
      } else {
        console.log(chalk.bold.green('\nSuccessfully created a user!\n'));
      }
    });

  } catch(error) {
    console.error(error);
  }
  rl.close();
}

main();