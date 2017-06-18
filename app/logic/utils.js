const fs = require('fs');
const modifiedPath = './app/data/modified.json';

const arraySeperator = '+';

let getType = module.exports.getType = (param) => {
	if (Array.isArray(param)) return 'array';
	else if (typeof param === 'object') return 'object';
	else return 'value';
};

module.exports.readData = (path) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(JSON.parse(data));
			return;
		});
	});
};

module.exports.readDataSync = (path) => {
	let dataString = fs.readFileSync(path, 'utf8');
	if (dataString) return JSON.parse(dataString);
	return null;
};

module.exports.writeData = (path, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, 'utf8', (err) => {
			if (err) reject(err);
			resolve();
			return;
		});
	});
};

module.exports.getLastModified = () => {
	return new Promise((resolve, reject) => {
		fs.readFile(modifiedPath, 'utf8', (err, data) => {
			if (err) reject(err);
			if (data) resolve(JSON.parse(data));
			else resolve(null);
			return;
		});
	});
};

module.exports.getLastModifiedSync = () => {
	let dataString = fs.readFileSync(modifiedPath, 'utf8');
	if (dataString) return JSON.parse(dataString).lastModified;
	return null;
}

module.exports.updateLastModified = () => {
	const updatedTime = new Date().getTime();
	const updated = JSON.stringify({ "lastModified": updatedTime });
	return new Promise((resolve, reject) => {
		fs.writeFile(modifiedPath, updated, 'utf8', (err) => {
			if (err) reject(err);
			resolve(updatedTime);
			return;
		});
	});
};

module.exports.arrayIndexOf = (array, id) => {
	let sectionID;
	for (let i = 0; i < array.length; i++) {
		if (array[i].id == id) {
			sectionID = i;
			break;
		}
	}
	return sectionID;
};

module.exports.convertFileToForm = (data) => {
	for (let key in data) {
		if (getType(data[key]) === 'array' && data[key].length > 0 && getType(data[key][0]) === 'value') {
			data[arraySeperator + 'array-' + key] = data[key].join(arraySeperator);
		}
	}
	return data;
};

module.exports.convertFormToFile = (data) => {
	for (let key in data) {
		if (key.substr(0, 7) === arraySeperator + 'array-') {
			let newKey = key.substr(7);
			data[newKey] = data[key].split(arraySeperator);
			delete data[key];
		}
	}
	return data;
};