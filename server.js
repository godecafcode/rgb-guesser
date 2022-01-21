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
	userAnswerRGB,
	dictionaryMatchId
) => {
	const jpegColorArray = rgbDictionary[dictionaryMatchId];
	const accuracyPerRGBArray = jpegColorArray.map((rgbPiece, idx) => {
		const userAnswerPiece = Math.round(+userAnswerRGB[idx]);
		const smallestNum = Math.min(userAnswerPiece, +rgbPiece);
		const largestNum = Math.max(userAnswerPiece, +rgbPiece);
		return (smallestNum / largestNum) * 100;
	});

	const accuracyPercentage =
		accuracyPerRGBArray.reduce((a, b) => a + b, 0) / accuracyPerRGBArray.length;

	return { jpegColorArray, accuracyPerRGBArray, accuracyPercentage };
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
	const { userAnswerRGB, dictionaryMatchId } = req.body;
	const accuracyObj = calculateRGBAccuracy(
		rgbDictionary,
		userAnswerRGB,
		dictionaryMatchId
	);

	res.json(accuracyObj);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
