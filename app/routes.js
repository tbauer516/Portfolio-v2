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

		let sectionID = utils.arrayIndexOf(data.section, type);
		if (sectionID == undefined)
			res.redirect('/');

		dataSubset = data.section[sectionID];

		if (id) {
			if (id === 'body')
				dataSubset = dataSubset.body;
			else
				dataSubset = dataSubset.body[id];
		}

		dataSubset = utils.convertFileToForm(dataSubset);

		res.render('views/edit.njk', {
			title: 'Portfolio Edit',
			data: dataSubset,
			id: id,
			type: type,
			getType: utils.getType
		});
	});

	app.post('/edit/:type/:id?', (req, res) => {
		let data = utils.readDataSync(root + 'data/index.json');
		const type = req.params.type;
		const id = req.params.id === 'body' ? 'body' : parseInt(req.params.id);

		let sectionID = utils.arrayIndexOf(data.section, type);

		if (sectionID == undefined) {
			res.status(400);
			return res.json({ message: 'This id does not exist' });
		}

		let url = req.body.demo;

		let saveImg = Promise.resolve();
		if (url) {
			let folder = type;
			let filename = req.body.title.toLowerCase().split(' ').join('-') + '.jpg';
			saveImg = imgSave.saveScreenshot(url, folder + '/' + filename);
		}

		let saveFields = Promise.resolve().then(() => {
			let dataSubset = data.section[sectionID];

			if (id != undefined) {
				if (id === 'body')
					dataSubset = dataSubset.body;
				else
					dataSubset = dataSubset.body[id];
			}

			let newData = utils.convertFormToFile(req.body);
			for (let key in newData) {
				dataSubset[key] = newData[key];
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