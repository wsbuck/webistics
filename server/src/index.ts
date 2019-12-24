import sls from 'serverless-http';
import bodyParser from 'body-parser';
import express from 'express';
import AWS from 'aws-sdk';
import uuid from 'uuid/v1';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

const ANALYTICS_TABLE = process.env.DYNAMODB_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb: AWS.DynamoDB.DocumentClient;

if (IS_OFFLINE) {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

interface AnalyticsPostBody {
  ipAddress: string;
}

app.use(bodyParser.json({ strict: false }));
app.use(function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', process.env.MY_DOMAIN);
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-type, Accept'
  );
  next();
});

// Create POST Analytics endpoint
app.post('/analytics', function (req, res) {
  const { ipAddress }: AnalyticsPostBody = req.body;

  const params = {
    TableName: ANALYTICS_TABLE,
    Item: {
      id: uuid(),
      ipAddress: ipAddress
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create analytics object' });
    }
    res.json({ ok: true });
  });
});

// Create GET Analytics endpoint
app.get('/analytics', function (req, res) {
  const params = {
    TableName: ANALYTICS_TABLE,
  };

  dynamoDb.scan(params, function (error, data) {
    if (error) {
      console.error('unable to get items');
      res.status(500).json({ error });
    }
    res.status(200).json(data.Items)
  });
});

if (IS_OFFLINE) {
  app.listen(8080, () => console.log('Listening on port 8080'));
}

module.exports.handler = sls(app);
