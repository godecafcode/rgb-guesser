import express from 'express';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import path, { dirname } from 'path';
import session from 'express-session';

import initColorSequence from './utils/initColorSequence.js';

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	session({
		secret: uuidv4(),
		resave: false,
		saveUninitialized: false,
	})
);

const calculateRGBAccuracy = (
	rgbDictionary,
	userAnswerInRgb,
	dictionaryMatchId
) => {
	const jpegRgbValue = rgbDictionary[dictionaryMatchId];
	const rgbAccuracyArr = jpegRgbValue.map((value, idx) => {
		const userAnswer = +userAnswerInRgb[idx];
		const rgbToMatch = +value;
		const [smNum, lgNum] = [userAnswer, rgbToMatch].sort((n1, n2) => n1 - n2);
		return (smNum / lgNum) * 100;
	});

	const accuracyPercentage =
		rgbAccuracyArr.reduce((a, b) => a + b, 0) / rgbAccuracyArr.length;

	return { jpegRgbValue, rgbAccuracyArr, accuracyPercentage };
};

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get('/init-session', (req, res) => {
	const { base64DataDictionary, rgbDictionary } = initColorSequence();
	req.session.rgbDictionary = rgbDictionary;
	res.json(base64DataDictionary);
});
app.post('/validate-user-answer', (req, res) => {
	const rgbDictionary = req.session.rgbDictionary;
	const { userAnswerInRgb, dictionaryMatchId } = req.body;
	const accuracyObj = calculateRGBAccuracy(
		rgbDictionary,
		userAnswerInRgb,
		dictionaryMatchId
	);

	res.json(accuracyObj);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
