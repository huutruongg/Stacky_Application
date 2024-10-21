// testDdosQueue.ts
import axios from 'axios';
import { log } from 'console';
import dotenv from 'dotenv';
dotenv.config();

// Function to simulate sending multiple requests
const sendMultipleRequests = async (numRequests: number) => {
    const promises = [];
    // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzEzNmZkYjY5ZDcyZTcxNmIwYjYyNWIiLCJwcml2YXRlRW1haWwiOiJncHR0cG0zQGdtYWlsLmNvbSIsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3MjkzNDg0MDAsImV4cCI6MTcyOTM0OTMwMH0.FtZTrBdVNuQ7msDZILr6Ek7YP_kOtpB2l1LJVyi1pqE";
    // log(`${process.env.URL_SERVER}/job-post/get-all`)
    for (let i = 0; i < numRequests; i++) {
        promises.push(
            axios.get(`https://happily-novel-chamois.ngrok-free.app/job-post/get-all`)
                .then((res) => console.log(`Request ${i + 1} successful:`, res.data))
                .catch((err) => console.log(`Request ${i + 1} failed:`, err.message))
        );
    }
    await Promise.all(promises);
    console.log(`${numRequests} requests sent.`);
};

// Run the test
sendMultipleRequests(1001); // Simulate sending 50 requests at once
