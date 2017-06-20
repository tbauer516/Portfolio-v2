const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const fs = require('fs');

const environments = {
	development: 0,
	production: 1
};

let environment = process.env.ENVIRONMENT || 'production';

const users = {};
const authUsers = JSON.parse(fs.readFileSync('./app/config/auth-users.json', 'utf8')).authorized;

let getSecret = () => {
	let secret = fs.readFileSync('./app/config/client-secret.json', 'utf8');
	return JSON.parse(secret);
};

let verify = (accessToken, refreshToken, profile, done) => {
	if (profile && isUserAuth(profile.id)) {
		users[profile.id] = profile;
		return done(null, profile);
	}
	return done(null, false);
};

let getStrategy = (secret) => {
	if (!secret)
		throw('Secret was not initialized');

	return new GoogleStrategy(
		{
			clientID: secret.web.client_id,
			clientSecret: secret.web.client_secret,
			callbackURL: secret.web.redirect_uris[environments[environment]]
		},
		verify
	);
};

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	let user = users[id];
	done(null, user);
});

passport.use(getStrategy(getSecret()));

let isUserAuth = module.exports.isUserAuth = (userID) => {
	for (let i = 0; i < authUsers.length; i++) {
		if (userID === authUsers[i])
			return true;
	}
	return false;
};

module.exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		let userID = req.user.id;
		if (isUserAuth(userID))
			return next();
	}

	res.redirect("/");
};

module.exports.initialize = () => {
	return passport.initialize();
};

module.exports.session = () => {
	return passport.session();
};

module.exports.auth = () => {
	return passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] });
};

module.exports.authCallback = () => {
	let message = 'Login attempt failed.';
	return passport.authenticate('google', { failureRedirect: '/error?message=' + encodeURIComponent(message) });
};