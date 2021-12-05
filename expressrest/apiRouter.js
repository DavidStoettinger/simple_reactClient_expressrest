const express = require('express');
const apiRouter = express.Router();
const bodyparser = require('body-parser');
const fs = require('fs');

//getAll
apiRouter.get('/', async (req, res, next) => {
    try {
        console.log("GET \n");
        fs.readFile('./data.json', (err, data) => {
            if (err) throw err;
            let jsonData = JSON.parse(data);
            res.status(200).json(jsonData);
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Create via a simple get -> just for easier in web try
apiRouter.get('/create/:title/:description', async (req, res, next) => {
    try {
        fs.readFile('./data.json', (err, data) => {
            if (err) throw err;
            let jsonData = JSON.parse(data);

            //-- to avoid any problems with id, when an article is deleted.
            // old was just articles.length + 1
            const jsonLength = jsonData.articles.length;
            console.log(jsonLength);
            const newID = jsonData.articles[jsonLength-1].ID+1;

            jsonData.articles.push({ID: newID, title: req.params.title, description: req.params.description});
            const jsonStringify = JSON.stringify(jsonData);
            fs.writeFile('./data.json', jsonStringify, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res.status(200).json(jsonStringify);
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


//Post -> req.body has new article
apiRouter.post('/post', async (req, res, next) => {

    try {
        console.log("POST WITH DATA");
        console.log("TITLE: " + req.body.title);
        console.log("Description: " +req.body.description);
        console.log("\n");
        fs.readFile('./data.json', (err, data) => {
            if (err) throw err;
            let jsonData = JSON.parse(data);

            //-- to avoid any problems with id, when an article is deleted.
            // old was just articles.length + 1
            const jsonLength = jsonData.articles.length;
            console.log(jsonLength);
            const newID = jsonData.articles[jsonLength-1].ID+1;

            jsonData.articles.push({ID: newID, title: req.body.title, description: req.body.description});
            const jsonStringify = JSON.stringify(jsonData);
            fs.writeFile('./data.json', jsonStringify, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res.status(200).json(jsonData);
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


apiRouter.delete('/delete/:deleteId', async (req, res, next) => {

    try {
        const deleteID = req.params.deleteId;
        console.log("DELETE item with id: " + deleteID);

        fs.readFile('./data.json', (err, data) => {
            if (err) throw err;
            let jsonData = JSON.parse(data);

            //cause delete/splice didnt work
            jsonData.articles = jsonData.articles.filter(item => item.ID != deleteID);


            const jsonStringify = JSON.stringify(jsonData);
            fs.writeFile('./data.json', jsonStringify, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res.status(200).json(jsonStringify);
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



apiRouter.patch('/:updateId', async (req, res, next) => {
    try {
        const updateId = req.params.updateId;
        console.log("UPDATE item with id: " + updateId);

        fs.readFile('./data.json', (err, data) => {
            if (err) throw err;
            let jsonData = JSON.parse(data);

            let updateElement = null;
            for(let key in jsonData.articles){
                if(jsonData.articles[key].ID == updateId){
                    updateElement = jsonData.articles[key];
                    updateElement.title = req.body.title;
                    updateElement.description = req.body.description;
                    jsonData.articles.splice(key,1,updateElement);
                    break;
                }
            }

            const jsonStringify = JSON.stringify(jsonData);
            fs.writeFile('./data.json', jsonStringify, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res.status(200).json(jsonData);
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = apiRouter;