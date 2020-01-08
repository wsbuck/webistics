import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';

export default function hello(): void {
  clear();
  console.log(
    chalk.greenBright(
      figlet.textSync('WEBISTICS', {
        font: 'Basic',
        horizontalLayout: 'full',
      })
    )
  );
}
