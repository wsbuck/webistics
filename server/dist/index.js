"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_http_1 = __importDefault(require("serverless-http"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const v1_1 = __importDefault(require("uuid/v1"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = express_1.default();
const ANALYTICS_TABLE = process.env.DYNAMODB_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE) {
    dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    });
}
else {
    dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
}
app.use(body_parser_1.default.json({ strict: false }));
app.use(function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', process.env.MY_DOMAIN);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept');
    next();
});
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
    console.log('start');
    const params = {
        TableName: ANALYTICS_TABLE,
    };
    console.log(ANALYTICS_TABLE);
    dynamoDb.scan(params, function (error, data) {
        if (error) {
            console.error('unable to get items');
            res.status(500).json({ error });
        }
        res.status(200).json(data.Items);
    });
});
if (IS_OFFLINE) {
    app.listen(8080, () => console.log('Listening on port 8080'));
}
module.exports.handler = serverless_http_1.default(app);
//# sourceMappingURL=index.js.map