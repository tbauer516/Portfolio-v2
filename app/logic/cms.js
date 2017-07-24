const root = './app/';
const utils = require('./utils.js');
const imgSave = require('./phantomWrapper.js');

let lastAccessed = new Date().getTime();
let lastModified = utils.getLastModifiedSync();
let fullData;

let getData = () => {
	return Promise.resolve().then(() => {
		if (!fullData || lastModified > lastAccessed) {
			console.log('New data updated');
			return utils.readData(root + 'data/index.json')
			.then(data => {
				fullData = data;
				lastAccessed = new Date().getTime();
			})
			.catch(err => { console.log(err); });
		}
	});
};

module.exports.getIndexData = (user) => {
	return getData()
	.then(() => {
		return {
			title: 'Portfolio Home Page',
			data: fullData,
			auth: user != undefined
		};
	})
	.catch(err => { console.log(err); });
};

module.exports.getEditData = (type, id) => {
	let dataSubset;

	return getData()
	.then(() => {
		let data = fullData;
		let sectionID = utils.arrayIndexOf(data.section, type);
		if (sectionID == undefined)
			throw({ status: 400, message:'Section not found' });

		dataSubset = data.section[sectionID];

		if (id) {
			if (id === 'body')
				dataSubset = dataSubset.body;
			else
				dataSubset = dataSubset.body[id];
		}

		dataSubset = utils.convertFileToForm(dataSubset);

		return {
			title: 'Portfolio Edit',
			data: dataSubset,
			id: id,
			type: type,
			getType: utils.getType
		};
	})
	.catch(err => { console.log(err); });
};

module.exports.postEditData = (type, id, body) => {
	return getData()
	.then(() => {
		let data = fullData;
	
		let sectionID = utils.arrayIndexOf(data.section, type);

		if (sectionID == undefined) {
			throw({ status: 400, message: 'This id does not exist' });
		}

		let url = body.demo;

		let saveImg = Promise.resolve();
		if (url) {
			let folder = type;
			let filename = body.title.toLowerCase().split(' ').join('-') + '.jpg';
			saveImg = imgSave.saveScreenshot(url, folder + '/' + filename);
		}

		let saveFields = Promise.resolve().then(() => {
			let dataSubset = data.section[sectionID];

			if (id === 'body')
				dataSubset = dataSubset.body;
			if (typeof id === 'number' && id >= 0)
				dataSubset = dataSubset.body[id];

			let newData = utils.convertFormToFile(body);
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
			
		})
		.catch(err => { console.log(err); });
	});
};