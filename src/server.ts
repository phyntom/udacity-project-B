import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {
   // Init the Express application
   const app = express();

   // Set the network port
   const port = process.env.PORT || 8082;

   // Use the body parser middleware for post requests
   app.use(bodyParser.json());

   function isValidURL(inputURL: string): boolean {
      let url;
      try {
         new URL(inputURL);
      } catch (error) {
         return false;
      }
      return true;
   }

   // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
   // GET /filteredimage?image_url={{URL}}
   // endpoint to filter an image from a public url.
   // IT SHOULD
   //    1. validate the image_url query
   //    2. call filterImageFromURL(image_url) to filter the image
   //    3. send the resulting file in the response
   //    4. deletes any files on the server on finish of the response
   // QUERY PARAMATERS
   //    image_url: URL of a publicly accessible image
   // RETURNS
   //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

   /**************************************************************************** */

   app.get('/filteredimage', async (req: Request, res: Response) => {
      let files: string[] = [];
      try {
         if (!req.query.image_url) {
            res.status(400).send('no image url provided');
         }
         if (!isValidURL(req.query.image_url)) {
            res.status(400).send('invalid image url');
         }
         let filteredImagePath = await filterImageFromURL(req.query.image_url);
         res.sendFile(filteredImagePath);
         files.push(filteredImagePath);
         res.on('finish', () => {
            deleteLocalFiles(files);
         });
      } catch (error) {
         console.log(error);
         res.status(400).send('bad request ');
      }
   });

   // Root Endpoint
   // Displays a simple message to the user
   app.get('/', async (req, res) => {
      res.send('try GET /filteredimage?image_url={{}}');
   });

   // Start the Server
   app.listen(port, () => {
      console.log(`server running http://localhost:${port}`);
      console.log(`press CTRL+C to stop server`);
   });
})();
