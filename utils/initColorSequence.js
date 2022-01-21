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
		frameData[i++] = parseInt(rgbArray[0]); // red
		frameData[i++] = parseInt(rgbArray[1]); // green
		frameData[i++] = parseInt(rgbArray[2]); // blue
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

const SEQUENCE_LENGTH = 20;
const initColorSequence = () => {
	const base64DataHashmap = {};
	const rgbHashmap = {};
	for (let i = 0; i < SEQUENCE_LENGTH; i++) {
		const { data, rgb } = generateBase64Jpeg();
		const identifier = uuidv4();
		rgbHashmap[identifier] = rgb;
		base64DataHashmap[i] = { hashmapMatchId: identifier, data };
	}
	return { base64DataHashmap, rgbHashmap };
	// const sequence = Array.apply(null, Array(SEQUENCE_LENGTH)).map(() => {
	// 	return { id: Math.floor(Math.random() * 1000), ...generateBase64Jpeg() };
	// });

	// return sequence;
};

export default initColorSequence;
