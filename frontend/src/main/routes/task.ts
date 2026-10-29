import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {

    app.get('/home', async (req, res) => {
        try {
            // An example of connecting to the backend (a starting point). Get data later
            const responseCaseData = await axios.get('http://localhost:4000/get-example-case');

            console.log(responseCaseData.data);
            res.redirect('/load-items');
        } catch (error) {
            console.error('Error making request:', error);
            res.render('home', {});
        }
    });

    app.post('/items/:id/editStatus/:isEditingStatus', async (req, res) => {
        try {
            const id = req.params.id;
            const wasEditing = req.params.isEditingStatus === 'true';

            // Retrieve the item again in case status was changed by someone else
            const response = await axios.get('http://localhost:4000/get-task-by-id', {
                params: {
                caseId: 1,
                taskId: id          
                }
            });

            console.log(response.data);
            
            res.render('task', {
                itemData: response.data,
                isEditingStatus: !wasEditing
            });
        } catch (error) {
            console.error('Error loading task:', error);
            res.status(500).send('Unable to load task');
            }
    });

    app.post('/task/save/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const strNewStatusCode = req.body.status;

            const objTask = await axios.get('http://localhost:4000/get-task-by-id', {
                params: {
                caseId: 1,
                taskId: id          
                }
            });

            if(objTask.data.statusCode === strNewStatusCode) {
                res.render('task', {
                    itemData: objTask.data,
                    isEditingStatus: true,
                    statusError: 'You must pick a different status before saving or discard your changes to cancel'
                });     
                return;           
            }

            const targetUrl = `http://localhost:4000/patch-task/${id}/${strNewStatusCode}`;

            const response = await axios.patch(targetUrl);

            console.log(response.data);

            res.render('task', {
                itemData: response.data,
                isEditingStatus: false
            });

        } catch (error) {
            console.error('Error making request:', error);
            res.render('home', {});
        }
    });

    app.get('/tasks/:id/delete', async (req, res) => {
        try {
        const id = req.params.id;

        await axios.delete(`http://localhost:4000/delete-task/${id}`);

        res.redirect('/load-items');
        } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Unable to delete task');
        }
    });

}
