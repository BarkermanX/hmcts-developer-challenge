import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {

    // Default root loads the case page
    app.get('/', async (req, res) => {
        try {
            const responseCaseData = await axios.get('http://localhost:4000/get-example-case');

            console.log(responseCaseData.data);
                res.render('caseWrapper', { example: responseCaseData.data, taskData: [] });
        } catch (error) {
            console.error('Error making request:', error);
            res.render('caseWrapper', {});
        }
    });

    // Get All tasks and return the data
    app.get('/get-tasks', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:4000/get-task-list');
            res.json(response.data);
        } catch (error) {
            console.error('Error getting tasks:', error);
            res.status(500).json({ error: 'Unable to load tasks' });
        }
    });

    

    // Load an item by Id
    app.get('/task/:id/open', async (req, res) => {
        try {
            const id = req.params.id;

            const response = await axios.get('http://localhost:4000/get-task-by-id', {
                params: {
                caseId: 1,
                taskId: id          
                }
            });

            console.log(response.data);

            res.render('task', {
                taskData: response.data,
                isEditingStatus: false
            });
        } catch (error) {
            console.error('Error loading task:', error);
            res.status(500).send('Unable to load task');
        }
    });

    // From the case create a new task
    app.post('/tasks/create', async (req, res) => {
        try {
            const blankTask = {
                id: '',
                caseId: '1',
                title: '',
                description: '',
                statusCode: '',
                status: '',
                dueDate: ''
            };

            res.render('task', {
                taskData: blankTask,
                isEditingStatus: true,
                isCreateNew: true
            });
        } catch (error) {
            console.error('Error loading task:', error);
            res.status(500).send('Unable to load task');
        }
    });

    app.get('/task/deleteSuccess', async (req, res) => {
        try {
            res.render('TaskDeletedSuccessfully');
        } catch (error) {
            console.error('Error loading task:', error);
            res.status(500).send('Unable to load task');
        }
    });

    
}