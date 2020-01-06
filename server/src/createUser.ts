import AWS from 'aws-sdk';
import clear from 'clear';
import bcrypt from 'bcrypt';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as figlet from 'figlet';
import * as dotenv from 'dotenv';

dotenv.config();

async function getInputs(): Promise<Array<string>> {
  return inquirer.prompt([
    {
      name: 'username',
      message: chalk.blue('Enter a username: '),
    },
    {
      type: 'password',
      name: 'password1',
      message: chalk.blue('Enter a password: '),
    },
    {
      type: 'password',
      name: 'password2',
      message: chalk.blue('Please repeat the password: '),
    }
  ]).then(answers => {
    if (answers.password1 !== answers.password2) {
      throw new Error('Password\'s do not match!');
    }
    return [answers.username, answers.password1]
    
  });
}

async function main(): Promise<void> {
  const USER_TABLE = process.env.USER_TABLE;
  const REGION = process.env.REGION;
  
  const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: REGION,
  });

  // const dynamoDb = new AWS.DynamoDB.DocumentClient({
  //   region: 'localhost',
  //   endpoint: 'http://localhost:8000'
  // });

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
}

main();