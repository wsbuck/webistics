import shell from 'shelljs';

import hello from './cliScripts/hello';
import createUser from './cliScripts/createUser';
import createEnv from './cliScripts/createEnv';

// async function deploy(): Promise<void> {
//   return new Promise((resolve) => {
//     const child = spawn('sls deploy --env production');
//     resolve();
//   });
// }

async function main(): Promise<void> {
  hello();
  await createEnv();
  // const child = spawnSync('sls deploy --env production');
  // console.error('error', child.error);
  // console.log('stdout ', child.stdout);
  // console.error('stderr ', child.stderr);
  const { stdout } = shell.exec('sls deploy --env production');
  console.log(stdout);
  await createUser();
}

main();
