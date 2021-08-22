"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bodyParser from 'body-parser';
const util_1 = require("./util/util");
(() => __awaiter(this, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    function isValidURL(inputURL) {
        let url;
        try {
            new URL(inputURL);
        }
        catch (error) {
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
    app.get('/filteredimage', (req, res) => __awaiter(this, void 0, void 0, function* () {
        let files = [];
        try {
            if (!req.query.image_url) {
                res.status(400).send('no image url provided');
            }
            if (!isValidURL(req.query.image_url)) {
                res.status(400).send('invalid image url');
            }
            let filteredImagePath = yield util_1.filterImageFromURL(req.query.image_url);
            console.log(filteredImagePath);
            res.sendFile(filteredImagePath);
            files.push(filteredImagePath);
            res.on('finish', () => {
                util_1.deleteLocalFiles(files);
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).send('bad request ');
        }
    }));
    // Root Endpoint
    // Displays a simple message to the user
    app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send('try GET /filteredimage?image_url={{}}');
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map