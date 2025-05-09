// Require all dependencies
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const https = require('https');
dotenv.config();
const saltRounds = 10;

// MongoDB connection
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@bloom-space.sx33zyf.mongodb.net/?retryWrites=true&w=majority&appName=bloom-space`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

// Create server
const app = express()
const port = 3000
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Server is awake!');
});

// 
app.post('/createAccount', async (req, res) => {
    let { username, password, email } = req.body;
    username = String(username), password = String(password), email = String(email);
    const result = await createAccount(username, password, email);
    res.status(result[0]);
    res.json({ message: result[1] });
});

async function createAccount(username, password, email) {
    try {
        await client.connect();
        const db = client.db('bloom_space');
        const collection = db.collection('users');
        const foundUser = await collection.findOne({ email: email });
        if (foundUser) {
            return [409, "Account already exists with this email"];
        }
        const hashedPassword = await hashPasswords(password);
        const result = await collection.insertOne({ username: username, password: hashedPassword, email: email, climate: [] });
        return [201, "Account created successfully"];
    } finally {
        await client.close();
    }
}

async function hashPasswords(password) {
    return await bcrypt.hash(password, saltRounds);
}

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    email = String(email), password = String(password);
    const result = await login(email, password);
    res.status(result[0]);
    res.json({ message: result[1] });
});

async function login(email, password) {
    try {
        await client.connect();
        const db = client.db('bloom_space');
        const collection = db.collection('users');
        const foundUser = await collection.findOne({ email: email });
        if (!foundUser) {
            return [401, "Invalid email or password"];
        }
        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (!validPassword) {
            const validToken = await collection.findOne({ email: email, token: password });
            if (validToken) {
                return [202, "Login successful"];
            }
            return [401, "Invalid email or password"];
        }
        return [200, "Login successful"];
    } finally {
        await client.close();
    }
}


// Create NodeMailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "spacebloom07@gmail.com",
        pass: process.env.GMAIL_PW,
    },
});

let mailOptions = {
    from: "spacebloom07@gmail.com",
    to: "",
    subject: "",
    text: "",
};

app.post('/forgotPassword', async (req, res) => {
    let { email } = req.body;
    email = String(email);
    const result = await forgotPassword(email);
    res.status(result[0]);
    res.json({ message: result[1] });
});

async function forgotPassword(email) {
    try {
        await client.connect();
        const db = client.db('bloom_space');
        const collection = db.collection('users');
        const foundUser = await collection.findOne({ email: email });
        if (!foundUser) {
            return [404, "User not found"];
        }
        const token = Math.floor(Math.random() * 1000000);
        const result = await collection.updateOne({ email: email }, { $set: { token: String(token) } });
        mailOptions.to = email;
        mailOptions.subject = "Password Reset";
        mailOptions.text = `Your password reset token is ${token}. Enter this as your password.`;
        await transporter.sendMail(mailOptions);
        return [200, "Password reset token sent successfully"];
    } finally {
        await client.close();
    }
}

app.post('/resetPassword', async (req, res) => {
    let { email, password } = req.body;
    email = String(email), password = String(password);
    const result = await resetPassword(email, password);
    res.status(result[0]);
    res.json({ message: result[1] });
});

async function resetPassword(email, password) {
    try {
        await client.connect();
        const db = client.db('bloom_space');
        const collection = db.collection('users');
        const foundUser = await collection.findOne({ email: email });
        if (!foundUser) {
            return [404, "User not found"];
        }
        const result = await collection.updateOne({ email: email }, { $set: { password: await hashPasswords(password), token: "" } });
        return [200, "Password reset successfully"];
    } finally {
        await client.close();
    }
}

// Start server
app.listen(port, () => {
    console.log(`Bloom Space Server listening on port ${port}`)
});

function pingSelf() {
    https.get("https://bloom-space.onrender.com", (res) => {
        console.log(`Self-ping status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error('Ping failed:', err.message);
    });
}

// Start self-pinging loop
setInterval(pingSelf, 12 * 60 * 1000); // 12 minutes
pingSelf(); // Initial ping