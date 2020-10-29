import express, { static } from 'express';
import { appendFile } from 'fs';
import url from 'url';
import { multer } from multer;
import { bodyParser } from bodyParser;
var app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use('/public', static(__dirname + '/public'));
app.use(static(__dirname + '/public'));

app.post('/upload', function (request, respond) {
    var base64Data = req.body.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile("out.png", base64Data, 'base64', function (err) {
        console.log(err);
    });
});

app.listen(8080);