const root = './app/';
const utils = require('./utils.js');
const imgSave = require('./phantomWrapper.js');

let lastAccessed = new Date().getTime();
let lastModified = utils.getLastModifiedSync();
let fullData;

const getData = () => {
	return Promise.resolve()
	.then(() => {
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

const getTemplate = () => {
	return Promise.resolve()
	.then(() => {
		return utils.readData(root + 'data/template.json')
		.then(data => {
			return data;
		})
		.catch(err => { console.log(err); });
	});
};

module.exports.getIndexData = (user) => {
	return getData()
	.then(() => {
		return {
			title: 'Portfolio Home Page',
			data: fullData,
			auth: user != undefined,
			dateMonthYear: utils.formatMillisToMonthYear,
			dateFull: utils.formatMillisToDate
		};
	})
	.catch(err => { console.log(err); });
};

const getTemplateChild = (template, sectionName, templateName, id) => {
	let templateChild = template[sectionName][templateName];
	if (templateChild.type === 'object')
		return Object.assign(template[sectionName].all, templateChild.value);
	else if (id !== undefined && templateChild.type === 'array-of-objects')
		return templateChild.value;
	return template[sectionName].all;
};

const getDataChild = (data, sectionName, sectionIndex, id) => {
	let child = data;
	child = child[sectionName];
	child = child[sectionIndex];
	if (id !== undefined && Array.isArray(child[child.template]))
		child = child[child.template][id];

	return child;
};

module.exports.getEditData = (sectionName, sectionIndex, id) => {
	return getData()
	.then(getTemplate)
	.then(template => {
		let data = fullData;
		let templateName = data[sectionName][sectionIndex].template;

		if (Array.isArray(data) && sectionIndex === undefined)
			throw({ status: 400, message:'Section not found' });

		let dataChild = getDataChild(data, sectionName, sectionIndex, id);
		let templateChild = getTemplateChild(template, sectionName, templateName, id);

		dataChild = utils.convertFileToForm(dataChild, templateChild);

		return {
			title: 'Portfolio Edit',
			data: dataChild,
			template: templateChild,
			id: id,
			index: sectionIndex,
			templateName: templateName,
			sectionName: sectionName
		};
	});
};

module.exports.postEditData = (sectionName, sectionIndex, id, body) => {
	return getData()
	.then(getTemplate)
	.then(template => {
		let data = fullData;
		let templateName = data[sectionName][sectionIndex].template;

		if (Array.isArray(data) && sectionIndex === undefined)
			throw({ status: 400, message:'Section not found' });
		
		let url = body.demo;

		let saveImg = Promise.resolve();
		if (url) {
			let folder = templateName;
			let filename = body.title.toLowerCase().split(' ').join('-') + '.jpg';
			saveImg = imgSave.saveScreenshot(url, folder + '/' + filename);
		}

		let saveFields = Promise.resolve().then(() => {
			
			let dataChild = getDataChild(data, sectionName, sectionIndex, id);
			let templateChild = getTemplateChild(template, sectionName, templateName, id);

			let newData = utils.convertFormToFile(body, templateChild);
			for (let key in newData) {
				dataChild[key] = newData[key];
			}

			// if (id !== undefined)
			// 	fullData[sectionName][sectionIndex][id] = dataChild;
			// else
			// 	fullData[sectionName][sectionIndex] = dataChild;

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