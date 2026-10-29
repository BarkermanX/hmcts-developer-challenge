import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {

    // Get All tasks for a case and return the data
    // Case Id is hard coded here but would normally be accurate
    // On the server check the user has the rights/permissions to view these tasks
    // Both for this case and any sub categories (can't see completed tasks etc.)
    app.get('/tasks/list', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:4000/get-task-list', {
                params: {
                caseId: 1
                }
            });

            res.render('cases/_taskList', { taskData: response.data });
        } catch (error) {
            console.error('Error loading tasks:', error);
            res.status(502).send('Unable to load tasks');
        }
    });

    // Enable editing - when clicking the button rights/permission to edit should be checked on the server
    app.post('/task/:id/editStatus/:isEditingStatus', async (req, res) => {
        try {
            const id = req.params.id;
            const wasEditing = req.params.isEditingStatus === 'true';

            const response = await axios.get('http://localhost:4000/get-task-by-id', {
                params: {
                caseId: 1,
                taskId: id          
                }
            });

            console.log(response.data);
            
            res.render('task', {
                taskData: response.data,
                isEditingStatus: !wasEditing
            });
        } catch (error) {
            console.error('Error loading task:', error);
            res.status(500).send('Unable to load task');
            }
    });

    // Save a new task record.  Perform some validation on the client for speed
    // Further validation should be performed on the server for anything sensitve (such as prices etc.) 
    // Plus check on the server user has rights/permission to create new tasks.
    app.post('/task/save', async (req, res) => {
        try {
            const strTaskTitle = String(req.body.txtTitle ?? '').trim();
            const strTaskDescription = String(req.body.txtTaskDescription ?? '').trim();
            const strStatusCode = String(req.body.selectStatus ?? '');
            const strDueDateDay = String(req.body['dateDueDate-day'] ?? '');
            const strDueDateMonth = String(req.body['dateDueDate-month'] ?? '');
            const strDueDateYear = String(req.body['dateDueDate-year'] ?? '');

            const objErrors = {
                title: '',
                description: '',
                status: '',
                dueDate: '',
                errorsFound: false
            };

            const objTask = {
                id: 0,
                caseId: 1,
                title: strTaskTitle,
                description: strTaskDescription,
                statusCode: strStatusCode,
                status: '',
                dueDate: '',
                dueDateDay: strDueDateDay,
                dueDateMonth: strDueDateMonth,
                dueDateYear: strDueDateYear
            };

            if (!strTaskTitle) {
                objErrors.errorsFound = true;
                objErrors.title = 'Enter a title for this task';
            }

            if (!strTaskDescription) {
                objErrors.errorsFound = true;
                objErrors.description = 'Enter a description for this task';
            }

            if (!['0001', '0002', '0003', '0004'].includes(strStatusCode)) {
                objErrors.errorsFound = true;
                objErrors.status = 'Select a status for this task';
            }

            if (!strDueDateDay || !strDueDateMonth || !strDueDateYear) {
                objErrors.errorsFound = true;
                objErrors.dueDate = 'Enter a due date completing the day, month and year fields';
            } else {
                const day = parseInt(strDueDateDay, 10);
                const month = parseInt(strDueDateMonth, 10) - 1;
                const year = parseInt(strDueDateYear, 10);
                const dueDate = new Date(year, month, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (!strDueDateDay.match(/^\d{1,2}$/)
                    || !strDueDateMonth.match(/^\d{1,2}$/)
                    || !strDueDateYear.match(/^\d{4}$/)
                    || dueDate.getFullYear() !== year
                    || dueDate.getMonth() !== month
                    || dueDate.getDate() !== day) {
                    objErrors.errorsFound = true;
                    objErrors.dueDate = 'Enter a valid calendar date';
                } else if (dueDate < today) {
                    objErrors.errorsFound = true;
                    objErrors.dueDate = 'The due date must be in the future';
                } else {
                    objTask.dueDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00`;
                }
            }

            if (objErrors.errorsFound) {
                res.render('task', {
                    taskData: objTask,
                    isEditingStatus: true,
                    isCreateNew: true,
                    validationErrors: objErrors
                });
                return;
            }

            const response = await axios.post('http://localhost:4000/save-task', {
                ...objTask,
                dueDateDay: Number(strDueDateDay),
                dueDateMonth: Number(strDueDateMonth),
                dueDateYear: Number(strDueDateYear)
            });

            const objNewTask = response.data
            res.redirect(`/task/${objNewTask.id}/open`);

        } catch (error) {
            console.error('Error making request:', error);
            res.status(502).send('Unable to save task');
        }
    });

    // Update an existing record by id.
    // Should ideally handle concurrent users editing the same record and notify the user if changes not saved
    // If saving multiple records (audit history in this case) a transaction should be used if possible
    // Also check the user has permission to alter this record on the server in case the id parameter has been altered  
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
                };

                res.render('task', {
                    taskData: objTask.data,
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
                taskData: response.data,
                isEditingStatus: false
            });

        } catch (error) {
            console.error('Error making request:', error);
            res.render('home', {});
        }
    });

    // Delete the task by id
    // On the server right/permission should be checked to make sure this record can be deleted
    // Do not accept the pass id on good faith.  Valid this user can delete this task.
    app.get('/task/:id/delete', async (req, res) => {
        try {
            const id = req.params.id;

            await axios.delete(`http://localhost:4000/delete-task/${id}`);

            //res.redirect('/');
            res.render('caseWrapper', { deleteMessage: 'Task '+ id.toString() + ' deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).send('Unable to delete task');
        }
    });
}
