const root = './app/';
const fs = require('fs');
const imgSave = require('./logic/phantomWrapper.js');
const utils = require('./logic/utils.js');

let lastAccessed = new Date().getTime();
let lastModified = utils.getLastModifiedSync();
let fullData;

module.exports = (app) => {

	app.get('/', (req, res) => {

		Promise.resolve().then(() => {
			if (!fullData || lastModified > lastAccessed) {
				console.log('New data updated');
				return utils.readData(root + 'data/index.json')
				.then(data => {
					fullData = data;
					lastAccessed = new Date().getTime();
				})
				.catch(err => { console.log(err); });
			}
		})
		.then(() => {
			res.render('views/index.njk', {
				title: 'Portfolio Home Page',
				data: fullData,
				auth: true
			});
		})
		.catch(err => { console.log(err); });

	});

	app.get('/edit/:type/:id?', (req, res) => {
		const type = req.params.type;
		const id = req.params.id;
		let dataSubset;
		let data = utils.readDataSync(root + 'data/index.json');

		let sectionID;
		for (let i = 0; i < data.section.length; i++) {
			if (data.section[i].id == type) {
				sectionID = i;
				break;
			}
		}

		if (id && data.section[sectionID].body) {
			dataSubset = data.section[sectionID].body[id];
		} else if (data.section[sectionID].body) {
			dataSubset = data.section[sectionID];
		}

		res.render('views/edit.njk', {
			title: 'Portfolio Edit',
			data: dataSubset,
			id: id,
			type: type,
			getType: utils.getType
		});
	});

	app.post('/edit/:type/:id', (req, res) => {
		let data = utils.readDataSync(root + 'data/index.json');
		const type = req.params.type;
		const id = parseInt(req.params.id);

		let sectionID;
		for (let i = 0; i < data.section.length; i++) {
			if (data.section[i].id == type) {
				sectionID = i;
				break;
			}
		}

		if (!sectionID) {
			res.status(400);
			return res.json({ message: 'This id does not exist' });
		}

		let folder = type;
		let filename = req.body.title.toLowerCase().split(' ').join('-') + '.jpg';
		let url = req.body.demo;

		let saveImg = Promise.resolve();
		if (url)
			saveImg = imgSave.saveScreenshot(url, folder + '/' + filename);

		let saveFields = Promise.resolve().then(() => {
			for (let key in req.body) {
				data.section[sectionID].body[id][key] = req.body[key];
			}
			// fs.writeFileSync(root + '/data/index.json', JSON.stringify(data));
			return JSON.stringify(data);
		})
		.then(dataString => { return utils.writeData(root + 'data/index.json', dataString); })
		.then(() => { return utils.updateLastModified(); })
		.then(mod => { lastModified = mod });

		Promise.all([saveImg, saveFields])
		.then(() => {
			res.redirect('/');
		})
		.catch(err => { console.log(err); });
	});

	// ============================================
	// 404 in case a path is wrong ================
	// ============================================

	app.get('*', (req, res) => {
		res.status(404).render('views/404.njk', {
			title: '404 | Portfolio Not Found'
		});
	});
};