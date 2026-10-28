import axios from 'axios';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/home/:id', async (req, res) => {
    try {
        //const id = req.params.id;

      // An example of connecting to the backend (a starting point). Get data later
       const responseCaseData = await axios.get('http://localhost:4000/get-example-case');

       console.log(responseCaseData.data);
        res.render('home', { example: responseCaseData.data, itemData: [] });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });
}
