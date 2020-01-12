import sls from 'serverless-http';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import AWS from 'aws-sdk';
import uuid from 'uuid/v1';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { AnalyticsPostBody, LoginBody } from './types';

dotenv.config();

const app = express();
app.options('*', cors());
// app.use(cors());

const ANALYTICS_TABLE = process.env.DYNAMODB_TABLE;
const USER_TABLE = process.env.USER_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
const JWT_SECRET = process.env.JWT_SECRET;

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

app.use(bodyParser.json({ strict: false }));

const postCorsOptions = {
  origin: process.env.MY_DOMAIN
};

const feedCorsOptions = {
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
      return res.status(400).json({ error: 'Could not create analytics object' });
    }
    return res.status(201).json({ ok: true });
  });
});

// Create GET Analytics endpoint
app.get('/analytics', cors(feedCorsOptions), function (req, res) {
  const authHeader: string = req.header('Authorization');
  if (authHeader) {
    const token: string = authHeader.replace('Bearer ', '');
    try {
      jwt.verify(token, JWT_SECRET);
    } catch(err) {
      return res.status(401).json({ message: 'not authenticated' });
    }
    const params = {
      TableName: ANALYTICS_TABLE,
    };
    dynamoDb.scan(params, function (error, data) {
      if (error) {
        console.error('unable to get items');
        return res.status(500).json({ error });
      }
      return res.status(200).json(data.Items)
    });
  } else {
    return res.status(401).json({ message: 'not authenticated' });
  }
});


app.post('/login', cors(), function (req, res) {
  const { username, password }: LoginBody = req.body;

  if (!(typeof username === 'string') || !(typeof password === 'string')) {
    return res.status(401).json({message: 'incorrect password'});
  }
  const params = {
    TableName: USER_TABLE,
    Key: {
      username: username,
    },
  };

  dynamoDb.get(params, function (error, data) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
    if(data.Item && bcrypt.compareSync(password, data.Item.password)) {
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
