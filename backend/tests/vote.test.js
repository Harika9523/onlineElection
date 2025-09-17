const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

async function register(body) {
	return request(app).post("/api/auth/register").send(body);
}

async function login(email, password) {
	const res = await request(app).post("/api/auth/login").send({ email, password });
	return res.body.token;
}

async function seedElectionWithCandidate() {
	// Admin
	await register({ name: "Admin", email: "admin@example.com", password: "admin123", role: "admin", university: "Test U" });
	const admin = await User.findOne({ email: "admin@example.com" });

	// Student
	await register({ name: "Student", email: "student@example.com", password: "123456", role: "student", university: "Test U" });
	const student = await User.findOne({ email: "student@example.com" });
	student.isVerified = true;
	await student.save();

	// Election
	const now = new Date();
	const election = await Election.create({
		title: "Student Council",
		description: "Annual election",
		startDate: new Date(now.getTime() - 60 * 1000),
		endDate: new Date(now.getTime() + 60 * 60 * 1000),
		isActive: true,
		isCompleted: false,
		totalVotes: 0,
		createdBy: admin._id
	});

	// Candidate
	const candidate = await Candidate.create({
		name: "Alice",
		studentId: "S123",
		email: "alice@example.com",
		position: "President",
		department: "CS",
		year: 3,
		manifesto: "Improve campus life",
		isApproved: true,
		election: election._id,
		voteCount: 0
	});

	return { electionId: election._id.toString(), candidateId: candidate._id.toString() };
}

describe("Vote APIs", () => {
	test("student can cast a vote and cannot vote twice; admin can view results", async () => {
		const { electionId, candidateId } = await seedElectionWithCandidate();
		const studentToken = await login("student@example.com", "123456");
		const adminToken = await login("admin@example.com", "admin123");

		// First vote
		const first = await request(app)
			.post("/api/votes/cast")
			.set("Authorization", `Bearer ${studentToken}`)
			.send({ candidateId, electionId });
		expect(first.statusCode).toBe(201);
		expect(first.body).toHaveProperty("message", "Vote cast successfully");

		// Duplicate vote
		const dup = await request(app)
			.post("/api/votes/cast")
			.set("Authorization", `Bearer ${studentToken}`)
			.send({ candidateId, electionId });
		expect(dup.statusCode).toBe(400);
		expect(dup.body).toHaveProperty("message", "You have already voted in this election");

		// Admin can see results
		const results = await request(app)
			.get(`/api/votes/results/${electionId}`)
			.set("Authorization", `Bearer ${adminToken}`);
		expect(results.statusCode).toBe(200);
		expect(results.body).toHaveProperty("results");
	});
});
