import sls from 'serverless-http';
import bodyParser from 'body-parser';
import express from 'express';
import AWS from 'aws-sdk';

const app = express();
const ANALYTICS_TABLE = process.env.DYNAMODB_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface AnalyticsPostBody {
  ipAddress: string;
}

app.use(bodyParser.json({ strict: false }));

// Create POST Analytics endpoint
app.post('/analytics', function (req, res) {
  const { ipAddress }: AnalyticsPostBody = req.body;

  const params = {
    TableName: ANALYTICS_TABLE,
    Item: {
      ipAddress: ipAddress
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log('ok');
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

module.exports.handler = sls(app);
