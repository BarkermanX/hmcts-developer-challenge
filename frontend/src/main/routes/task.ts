import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {

    app.get('/home/:id', async (req, res) => {
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
}
