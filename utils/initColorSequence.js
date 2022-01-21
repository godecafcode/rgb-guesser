import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import jpeg from 'jpeg-js';

const MAX_RGB_INT = 255;
const generateRandomRgbPiece = () => {
	let rgbValue = Math.floor(Math.random() * MAX_RGB_INT).toString();
	while (rgbValue.length < 3) {
		rgbValue = `0${rgbValue}`;
	}
	return rgbValue;
};

const getRandomRgbArr = () => {
	const randomRgbColorArr = [];
	while (randomRgbColorArr.length < 3) {
		const randomRgbPiece = generateRandomRgbPiece();
		randomRgbColorArr.push(randomRgbPiece);
	}
	return randomRgbColorArr;
};

const generateBase64Jpeg = () => {
	const rgbArray = getRandomRgbArr();
	const width = 100,
		height = 100;
	const frameData = Buffer.alloc(width * height * 4);
	let i = 0;
	while (i < frameData.length) {
		frameData[i++] = parseInt(rgbArray[0]);
		frameData[i++] = parseInt(rgbArray[1]);
		frameData[i++] = parseInt(rgbArray[2]);
		frameData[i++] = 0xff; // alpha - ignored in JPEGs
	}
	const rawImageData = {
		data: frameData,
		width: width,
		height: height,
	};

	const jpegImageData = jpeg.encode(rawImageData, 50);

	const base64ImageData = Buffer.from(jpegImageData.data).toString('base64');

	return {
		data: base64ImageData,
		rgb: rgbArray,
	};
};

const SEQUENCE_LENGTH = 10;
const initColorSequence = () => {
	const base64DataDictionary = Object.create(null);
	const rgbDictionary = Object.create(null);
	for (let i = 0; i < SEQUENCE_LENGTH; i++) {
		const { data, rgb } = generateBase64Jpeg();
		const identifier = uuidv4();
		rgbDictionary[identifier] = rgb;
		base64DataDictionary[i] = { dictionaryMatchId: identifier, data };
	}
	return { base64DataDictionary, rgbDictionary };
};

export default initColorSequence;
