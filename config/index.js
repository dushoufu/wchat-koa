const production = {
	port: process.env.PORT || 10086,
	mongo_host: 'mongodb://39.108.137.234:28332/wchat',
	allow_origin: 'http://mohng.com'
};

const development = Object.assign({}, production, {
	allow_origin: 'http://localhost:8808'
});

module.exports = process.env.NODE_ENV === 'production' ? production : development;
