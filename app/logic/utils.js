const fs = require('fs');
const modifiedPath = './app/data/modified.json';

const arraySeperator = '+';
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]

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

/**
 * @param {array} array
 * @param {string} key
 * @param {string} val
 * @return {number}
 */
module.exports.arrayIndexOf = (array, key, val) => {
	let sectionIndex;
	for (let i = 0; i < array.length; i++) {
		if (array[i][key] == val) {
			sectionIndex = i;
			break;
		}
	}
	return sectionIndex;
};

const formatMillisToIso = (millis, type = 'full') => {
	const date = new Date(millis);
	let iso = date.toISOString().split('T')[0];
	if (type === 'full')
		return iso;
	else if (type === 'month') {
		return iso.split('-').reduce((result, val, i) => {
			if (i < 2) result.push(val);
			return result;
		}, [])
		.join('-');
	}
};

const formatIsoToMillis = (iso) => {
	if (iso === '')
		return 'current';
	if (iso.length < 8) {
		iso += '-01';
	}
	const date = new Date(iso);
	return date.getTime();
};

// string, url, date, month-year, array-of-strings, paragraph
module.exports.convertFileToForm = (data, template) => {
	data = JSON.parse(JSON.stringify(data));
	for (let key in template) {
		switch(template[key]) {
			case 'date':
				data[key] = formatMillisToIso(data[key], 'full');
				break;
			case 'month-year':
				if (data[key] !== 'current')
					data[key] = formatMillisToIso(data[key], 'month');
				break;
			case 'array-of-strings':
				data[key] = data[key].join('\n\n');
				break;
		}
	}
	return data;
};

module.exports.convertFormToFile = (data, template) => {
	data = JSON.parse(JSON.stringify(data));
	for (let key in template) {
		switch(template[key]) {
			case 'date':
				data[key] = formatIsoToMillis(data[key]);
				break;
			case 'month-year':
				data[key] = formatIsoToMillis(data[key]);
				break;
			case 'array-of-strings':
				data[key] = data[key].split('\r\n\r\n');
				break;
		}
	}
	return data;
};

module.exports.formatMillisToMonthYear = (millis) => {
	const date = new Date(millis);
	if (millis === 'current') return 'Current';
	return months[date.getMonth()] + ' ' + date.getFullYear();
};

module.exports.formatMillisToDate = (millis) => {
	const date = new Date(millis);
	return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
};