require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY;

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// ... Other middleware and routes

io.on('connection', (socket) => {
    socket.on('message', async (message) => {
        // Handle the incoming message and generate a response
        const result = await client.generateMessage({
            model: MODEL_NAME,
            temperature: 0.5,
            candidateCount: 1,
            prompt: {
                context: "Respond all questions just like a friend or buddy",
                examples: [
                    {
                        input: { content: "what is your name and how are you?" },
                        output: {
                            content: `my name is Rabbit Ai, and I am fine. What about you?`,
                        },
                    },
                ],
                messages: [{ content: message }],
            },
        });

        // Send the response to the client via WebSocket
        socket.emit('response', result[0].candidates[0].content);
    });
});

server.listen(3000, () => {
    console.log('API listening on port 3000');
});
