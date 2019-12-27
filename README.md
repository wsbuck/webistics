# Webistics
"You're supposed to push Webistics!"

Simple website analytics alternative that you can host
yourself with [Serverless](https://serverless.com/)

## Motivation
Now you don't have to use *[INSERT TECH BEHOMETH]*'s surveilance
software for simple analytics for your website.

Say "No" to tracking cookies

## Getting Started

### Prerequisites
* [serverless cli](#serverless-cli-installation)
* [typescript](#typescript-installation)
* [aws configuration](#aws-cli-configuration)

### Installation
```bash
git clone git@github.com:wsbuck/webistics.git
cd server
npm i
touch .env.production
touch .env
```

Update `.env.production` and `.env` with `MY_DOMAIN` and `DYNAMODB_TABLE` variables.
`MY_DOMAIN` is the website domain you would like to analyze traffic.
`DYNAMODB_TABLE` should just be 'analytics-table-dev` without the quotes.

In `.env` which is your develpment environment variables. Make sure to add
`LOCAL_DB_ENDPOINT=http://localhost:8000` and `IS_OFFLINE=true`

To run your server locally use in one terminal window to start local
dynamodb database.
```bash
sls dynamodb start
```

and the below code in another terminal to run your server and endpoint.
```
npm run start
```

### Deploy
```bash
npm run deploy
```

Then paste javascript code onto your website to track
```javascript
function addView(analyticsDomain) {
  fetch('https://ipapi.co/json/', {
  })
  .then(resp => resp.json())
  .then(data => {
    fetch(analyticsDomain, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  })
  .catch(err => console.log(err));
}

window.onload = addView('http://your-domain.com');
```

#### Serverless CLI Installation
[Documentation](https://serverless.com/framework/docs/)
```bash
npm install -g serverless
```

#### Typescript Installation
[Documentation](https://www.typescriptlang.org/docs/home.html)
```bash
npm install -g typescript
```

#### AWS CLI Configuration
[Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

You should have a aws config file in `~/.aws/config` location.