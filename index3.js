const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const HTML5ToPDF = require("html5-to-pdf")
const path = require("path")
const cheerio = require('cheerio')

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
        },
    ])
    .then(answer => {
        /*
        {username, location, bio, linkedinUrl, githubUrl}
        */
        const userRepositoryURL = 'https://github.com/' + answer.username + '?tab=repositories';

        axios.get(userRepositoryURL)
            .then(function (response) {
                // handle success
                //console.log("Axios response:");
                //console.log(response);
                const $ = cheerio.load(response.data);

                const div = $('#user-repositories-list');
                console.log("div:");
                const numOfPublicRepos = div.children("ul").children().length;
                console.log("Number of Public Repositories: " + numOfPublicRepos);

                const avatarURL = $(".user-profile-mini-avatar").children("img").attr("src");
                answer.avatarURL = avatarURL;

                const htmlTemplate = generateHtml(answer);

                fs.writeFile("index.html", htmlTemplate, () => {
                    const run = async () => {
                        const html5ToPDF = new HTML5ToPDF({
                            inputPath: path.join(__dirname, "index.html"),
                            outputPath: path.join(__dirname, "great.pdf"),
                            options: { printBackground: true }
                        });
                        await html5ToPDF.start();
                        await html5ToPDF.build();
                        await html5ToPDF.close();
                        console.log("DONE");
                        process.exit(0);
                    };
                    return run();
                });

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });

    });

function generateHtml(answer) {
    console.log("generateHtml()");
    console.log(answer.username);
    console.log(answer.location);
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
        <div>Name : ${answer.username}</div>
        <div>Location : ${answer.location}</div>
        <div>Bio : ${answer.bio}</div>
        <div>linkedinUrl : ${answer.linkedinUrl}</div>
        <div>githubUrl : ${answer.githubUrl}</div>
        <img src='${answer.avatarURL}'/>
    </body>
    </html>
    `;
    return htmlStr;
}