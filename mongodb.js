const { MongoClient } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {

    if (error) return console.log('unable connect to the database', error);

    const db = client.db(databaseName);

    db.collection('tasks').deleteMany({ description: 'second task' })
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });

});