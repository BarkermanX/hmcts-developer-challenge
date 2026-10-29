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

    app.post('/task/save', async (req, res) => {
        try {
            // Passed in details for the new task
            const strTaskTitle = req.body.txtTitle;
            const strTaskDescription = req.body.txtTaskDescription;
            const strStatusCode = req.body.selectStatus;
            const strDueDateDay =   req.body['dateDueDate-day'];
            const strDueDateMonth = req.body['dateDueDate-month'];
            const strDueDateYear =  req.body['dateDueDate-year'];            

            const objErrors = {
                title: '',
                description: '',
                status: '',
                dueDate: '',
                errorsFound: false
            }

            const objTask = {                
                title: strTaskTitle,
                description: strTaskDescription,
                status: strStatusCode,
                dueDate: strDueDateDay + '/' + strDueDateMonth + '/' + strDueDateYear,
                dueDateDay: strDueDateDay,
                dueDateMonth: strDueDateMonth,
                dueDateYear: strDueDateYear
            }

            // validate mandatory fields etc.
            if(strTaskTitle === '') {
                objErrors.errorsFound = true;
                objErrors.title = 'Enter a title for this task';         
            }

            if(strTaskDescription === '') {
                objErrors.errorsFound = true;
                objErrors.description = 'Enter a description for this task';         
            }

            if(strStatusCode === '') {
                objErrors.errorsFound = true;
                objErrors.status = 'Enter a status for this task';         
            }

            if (!strDueDateDay || !strDueDateMonth || !strDueDateYear) {
                objErrors.errorsFound = true;
                objErrors.dueDate = 'Enter a due date for this task completing the day, month and year fields';         
            } else {
                // validate the date is in the future
                const day = parseInt(strDueDateDay, 10);
                const month = parseInt(strDueDateMonth, 10) - 1;
                const year = parseInt(strDueDateYear, 10);

                const dueDate = new Date(year, month, day);

                // set the time to the end of today
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // verify date is valid
                if (dueDate.getFullYear() !== year || dueDate.getMonth() !== month || dueDate.getDate() !== day) {
                    objErrors.errorsFound = true;
                    objErrors.dueDate = 'Enter a valid calendar date';
                }
                // flag if the error is in the past
                else if (dueDate < today) {
                    objErrors.errorsFound = true;
                    objErrors.dueDate = 'The due date must be in the future';
                }
            }

            if(objErrors.errorsFound) {
                res.render('task', {
                    itemData: objTask,
                    isEditingStatus: true,
                    isCreateNew: true,
                    validationErrors: objErrors
                });     
                return;           
            } 

            const targetUrl = `http://localhost:4000/save-task/${''}/${strStatusCode}`;

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

    app.post('/task/save/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const strNewStatusCode = req.body.selectStatus;

            const objTask = await axios.get('http://localhost:4000/get-task-by-id', {
                params: {
                caseId: 1,
                taskId: id          
                }
            });

            if(objTask.data.statusCode === strNewStatusCode) {

                const objErrors = {
                    title: '',
                    description: '',
                    status: 'Enter a status for this task',
                    dueDate: '',
                    errorsFound: false
                }

                res.render('task', {
                    itemData: objTask.data,
                    isEditingStatus: true,
                    isCreateNew: true,
                    validationErrors: objErrors
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
