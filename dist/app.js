'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _dotenv=require('dotenv'),_dotenv2=_interopRequireDefault(_dotenv),_express=require('express'),_express2=_interopRequireDefault(_express),_serverSetup=require('./server-setup'),_serverSetup2=_interopRequireDefault(_serverSetup),_router=require('./routes/router'),_router2=_interopRequireDefault(_router);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}_dotenv2.default.config();var app=(0,_express2.default)();_serverSetup2.default.setPort(app);app.use(_router2.default);var port=app.get('PORT'),server=app.listen(process.env.PORT||port);exports.default=server;