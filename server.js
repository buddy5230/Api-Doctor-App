let express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./database/db');
    // eslint-disable-next-line no-undef
    path = require('path');

// Express Route
const userRoute = require('../doctor-api/route/user.route');

// Connecting MongDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('Database successfully connected');
}, 
    error => {
        console.log('Could not connect to database: ' + error)
    }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors());
app.use('/users', userRoute);

if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-undef
    app.use(express.static(path.join(__dirname, '../build')))

    app.get("*", (req, res) => {
        // eslint-disable-next-line no-undef
        res.sendFile(path.join(__dirname, "../build/index.html"))
    })
}

// PORT
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
    //
    // eslint-disable-next-line no-undef
    next(createError(404))
})

// Error handler
app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
})
