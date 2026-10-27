import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
    // An example of connecting to the backend (a starting point). Get data later
       const responseCaseData = await axios.get('http://localhost:4000/get-example-case');

       console.log(responseCaseData.data);
        res.render('caseList', { example: responseCaseData.data, itemData: [] });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.get('/load-items', async (req, res) => {
    try {
      const responseCaseData = await axios.get(
        'http://localhost:4000/get-example-case'
      );

      const responseItemData = await axios.get(
        'http://localhost:4000/get-task-list'
      );

      res.render('caseList', {
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

}
