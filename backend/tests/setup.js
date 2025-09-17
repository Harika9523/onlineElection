const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
	process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	process.env.MONGO_URL = uri;
	await mongoose.connect(uri, { dbName: 'test' });
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	if (mongoServer) {
		await mongoServer.stop();
	}
});

afterEach(async () => {
	const collections = await mongoose.connection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
}); 