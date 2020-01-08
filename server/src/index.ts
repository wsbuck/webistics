import sls from 'serverless-http';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import AWS from 'aws-sdk';
import uuid from 'uuid/v1';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

const ANALYTICS_TABLE = process.env.DYNAMODB_TABLE;
const USER_TABLE = process.env.USER_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb: AWS.DynamoDB.DocumentClient;

if (IS_OFFLINE === 'true') {
  console.log('Connecting to local DB');
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

interface AnalyticsPostBody {
  ip: string;
  city: string;
  region: string;
  country_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  org: string;
}

app.use(bodyParser.json({ strict: false }));

const postCorsOptions = {
  origin: process.env.MY_DOMAIN
};

const getCorsOptions = {
  origin: '*'
};

// Create POST Analytics endpoint
app.post('/analytics', cors(postCorsOptions), function (req, res) {
  const {
    ip,
    city,
    region,
    // eslint-disable-next-line @typescript-eslint/camelcase
    country_code,
    postal,
    latitude,
    longitude,
    org,
  }: AnalyticsPostBody = req.body;

  const date = new Date();

  const params = {
    TableName: ANALYTICS_TABLE,
    Item: {
      id: uuid(),
      ipAddress: ip,
      city: city,
      region: region,
      // eslint-disable-next-line @typescript-eslint/camelcase
      countryCode: country_code,
      postal: postal,
      latitude: latitude,
      longitude: longitude,
      org: org,
      date: date.valueOf(),
      dateString: date.toDateString(),
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create analytics object' });
    }
    res.status(201).json({ ok: true });
  });
});

// Create GET Analytics endpoint
app.get('/analytics', cors(getCorsOptions), function (req, res) {
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

interface LoginBody {
  username: string;
  password: string;
}

app.post('/login', function (req, res) {
  console.log('body', req.body);
  const { username, password }: LoginBody = req.body;
  console.log('username:', username);
  const params = {
    TableName: USER_TABLE,
    Key: {
      username: username,
    },
  };

  dynamoDb.get(params, function (error, data) {
    if (error) {
      console.error(error);
      res.status(500).json({ error });
    }
    console.log(data);
    if(bcrypt.compareSync(password, data.Item.password)) {
      const payload = { username };
      // const options = { expiresin: '2d' };
      const options = {};
      const JWT_SECRET = process.env.JWT_SECRET;
      const token = jwt.sign(payload, JWT_SECRET, options);
      res.status(200).json({ token });
    } else {
      res.status(401).json({message: 'incorrect password'});
    }
  });
});

if (IS_OFFLINE === 'true') {
  app.listen(8080, () => console.log('Listening on port 8080'));
}

module.exports.handler = sls(app);
