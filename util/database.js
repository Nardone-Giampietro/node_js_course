const {MongoClient, ServerApiVersion} = require('mongodb');

let _db;

const uri = "mongodb+srv://new-user-1:QWE1597538246qwe@project0.j3p0n6o.mongodb.net/?retryWrites=true&w=majority&appName=Project0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const mongoConnect = (callback) => {
    client.connect()
        .then(client => {
            console.log("Connected to MongoDB");
            // There is no need to prepare a database. It will be created at the same time we
            // try to access to the database, if there is not one yet.
            _db = client.db('shop');
            callback();
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
};

const getDB = () => {
    if (_db) {
        return _db;
    }

    throw new Error("No database connection found.");
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
