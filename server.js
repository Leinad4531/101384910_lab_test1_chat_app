const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const {GroupMessage} = require('./models/message');

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb+srv://danieladebayo2004:Akindun123@mydb.2uoqtoa.mongodb.net/chat_app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Logout endpoint
app.get('/logout', (req, res) => {
    // Perform logout actions here (e.g., clearing session data)
    // Redirect to the signup page after logout
    res.redirect('/signup');
});




// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes


// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, username, password } = req.body; // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(409).send('User already exists');
        } else {
            // Create new user
            const newUser = new User({ firstname, lastname, username, password }); 
            await newUser.save();
            res.status(200).send('Signup successful');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user exists and password matches
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('leave room', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
    });

    // Handle group messages
    socket.on('chat message', async (data) => {
        const { from_user, room, message } = data;
        io.to(room).emit('chat message', { from_user, message });
        await GroupMessage.create({ from_user, room, message }); // Store group message in MongoDB
    });

    

    // Handle typing events
    socket.on('typing', (data) => {
        const { room } = data;
        socket.to(room).emit('typing', `${socket.id} is typing...`);
    });

    // Handle typing stopped events
    socket.on('typing stopped', (data) => {
        const { room } = data;
        socket.to(room).emit('typing stopped', `${socket.id} stopped typing.`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
