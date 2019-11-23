const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const writeFileAsync = util.promisify(fs.writeFile);
function generateHtml(response) {
    const htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div>Name : ${response.username}</div>
    <div>Location : ${response.location}</div>
    <div>Bio : ${response.bio}</div>
    <div>linkedinUrl : ${response.linkedinUrl}</div>
    <div>githubUrl : ${response.githubUrl}</div>
</body>
</html>
`;
    return htmlStr;
}
inquirer
    .prompt([
        {
            type: "input",
            message: "What is your user name?",
            name: "username"
        },
        {
            type: "input",
            message: "What is your location?",
            name: "location"
        },
        {
            type: "input",
            message: "What is your bio?",
            name: "bio"
        },
        {
            type: "input",
            message: "What is your linkedIn URL?",
            name: "linkedinUrl"
        },
        {
            type: "input",
            message: "What is your github URL?",
            name: "githubUrl"
        }
    ])
    .then(response => {
        console.log(response);
        const htmlStr = generateHtml(response);
        console.log(htmlStr);
        writeFileAsync('index.html', htmlStr).then(() => {
            console.log('look to the left <-');
        })
            .catch((err) => {
                console.log(err);
            });
    });