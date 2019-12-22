"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_http_1 = __importDefault(require("serverless-http"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const v1_1 = __importDefault(require("uuid/v1"));
const app = express_1.default();
const ANALYTICS_TABLE = process.env.DYNAMODB_TABLE;
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
app.use(body_parser_1.default.json({ strict: false }));
// Create POST Analytics endpoint
app.post('/analytics', function (req, res) {
    const { ipAddress } = req.body;
    const params = {
        TableName: ANALYTICS_TABLE,
        Item: {
            id: v1_1.default(),
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
        res.status(200).json(data.Items);
    });
});
module.exports.handler = serverless_http_1.default(app);
//# sourceMappingURL=index.js.map