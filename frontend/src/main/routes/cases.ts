import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {

    app.get('/get-tasks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:4000/get-task-list');
        res.json(response.data);
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ error: 'Unable to load tasks' });
    }
    });
}