import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      // An example of connecting to the backend (a starting point). Get data later
       const responseCaseData = await axios.get('http://localhost:4000/get-example-case');

       console.log(responseCaseData.data);
        res.render('home', { example: responseCaseData.data, itemData: [] });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.get('/load-items', async (req, res) => {
    try {

      console.log(req.params);

      const responseCaseData = await axios.get(
        'http://localhost:4000/get-example-case'
      );

      const responseItemData = await axios.get('http://localhost:4000/get-task-list', {
        params: {
          caseId: 1
        }
      });

      console.log(responseItemData.data);

      res.render('home', {
        example: responseCaseData.data,
        itemData: responseItemData.data
      });
    } catch (error) {
      console.error('Error loading items:', error);
      res.status(500).send('Unable to load items');
    }
  });

  app.get('/items/:id/delete', async (req, res) => {
    try {
      const id = req.params.id;

      await axios.delete(`http://localhost:4000/delete-task/${id}`);

      res.redirect('/load-items');
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).send('Unable to delete task');
    }
  });

  app.get('/items/:id/open', async (req, res) => {
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
        itemData: response.data,
        isEditingStatus: false
      });
    } catch (error) {
      console.error('Error loading task:', error);
      res.status(500).send('Unable to load task');
    }
  });

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
        itemData: blankTask,
        isEditingStatus: true,
        isCreateNew: true
      });
    } catch (error) {
      console.error('Error loading task:', error);
      res.status(500).send('Unable to load task');
    }
  });

}
