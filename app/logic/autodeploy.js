const childProcess = require('child_process');
const fs = require('fs');
const screenshot = require('./screenshot.js');

const updateData = async () => {
	let data = await new Promise((resolve, reject) => {
		fs.readFile('./app/data/index.json', 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(JSON.parse(data));
			return;
		});
    });
	return data;
};

const execCommand = async (command) => {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, (err, stdout, stderr) => {
            if (err) reject(err);
            resolve(stdout);
            return;
        });
    });
};

const gitPull = async () => {
    const commands = [
        'git pull origin master',
        'git checkout master'
    ];
	
	for (let i = 0; i < commands.length; i++) {
        console.log(await execCommand(commands[i]));
    }
};

const gitPush = async () => {
    const commands = [
        'git add .',
        'git commit -m "added pictures of projects"',
        'git push origin master'
    ];
    
    for (let i = 0; i < commands.length; i++) {
        console.log(await execCommand(commands[i]));
    }
};

const getFiles = async () => {
    const dir = './app/public/img/projects';

    await new Promise((resolve, reject) => {
        fs.access(dir, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (err) {
                fs.mkdirSync(dir);
            }
            resolve();
            return;
        });
    });
    return await new Promise((resolve, reject) => {
        fs.readdir('./app/public/img/projects', (err, files) => {
            if (err) reject(err);
            resolve(files);
            return;
        });
    })
    .catch(err => { console.log(err); });
};

const titleToFile = (title) => {
    return title.toLowerCase().split(' ').join('-') + '.jpg';
};

const parseProjects = async (data, files) => {
    let addedPicture = false;
    for (let i = 0; i < data.section.length; i++) {
        const section = data.section[i];
        if (section.template !== 'projects') continue;

		for (let j = 0; j < section.projects.length; j++) {
            const project = section.projects[j];
            const projectFile = titleToFile(project.title);
            
            if (files.indexOf(projectFile) > -1) continue;
            
            addedPicture = true;
            console.log(project.title);
            await screenshot(project.demo, projectFile);
		}
    }
    return addedPicture;
};

const autodeploy = async () => {
    console.log('Autodeploy has been called...');

	await gitPull();
	const data = await updateData();

    let files = await getFiles();

    const added = await parseProjects(data, files);

    if (added)
        await gitPush();
    console.log('Finished Syncing Data and Images...');

    return data;
};

module.exports.deploy = autodeploy;
module.exports.updateData = updateData;