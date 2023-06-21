//require('express-async-errors');
const cors = require('cors');
const express = require('express');
const compression = require('compression')
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const helmet = require("helmet");
const config = require('./middleware/constants');
//const authentication = require('./routes/authentication')(router);
const branch = require('./routes/branch.js');
const companyName = require('./routes/companyName.js');
const posTransactionBalance = require('./routes/posTransactionBalance.js');
const posProductions = require('./routes/posProductions.js');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.uri, {useNewUrlParser: true,  useUnifiedTopology: true, family: 4,})
.then(() => console.log('Connected to database: ' + config.db))
.catch(err => console.error('Could not connect to MongoDB ', err));

const server = app.listen(config.port, () => console.log('Listening on port ', config.port));

app.use(helmet());
app.use(cors({   origin: '*' })),
app.use(express.json({limit: '20mb', extended: true}));
app.use(compression({ level: 6, threshold: 0 }));
app.use(express.urlencoded({limit: '20mb', extended: true}));
//app.use('/authentication', authentication); 
app.use('/branch', branch);
app.use('/companyName', companyName);
app.use('/posTransactionBalance', posTransactionBalance);
app.use('/posProductions', posProductions);