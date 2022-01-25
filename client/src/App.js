import React, { useState, useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';
import { toFixed } from './utils';
import { CSSTransition } from 'react-transition-group';
import './index.css';

import RangeInput from './components/UI/RangeInput';
import Button from './components/UI/Button';
import ResultModal from './components/ResultModal/ResultModal';
import ColorSequenceList from './components/ColorSequence/ColorSequenceList';

const initialAccuracyState = {
	accuracy: {
		percentage: 0,
		individual: [],
	},
	combinedSessionAccuracy: [],
};
const accuracyReducer = (state, action) => {
	switch (action.type) {
		case 'RESET':
			return initialAccuracyState;
		case 'UPDATE':
			return {
				accuracy: {
					percentage: action.value.percentage,
					individual: action.value.individual,
				},
				combinedSessionAccuracy: [
					...state.combinedSessionAccuracy,
					action.value.percentage,
				],
			};
		default:
	}
};

const App = () => {
	const [gameIsFinished, setGameIsFinished] = useState(false);
	const [colorSequence, setColorSequence] = useState([]);
	const [colorsGuessed, setColorsGuessed] = useState([]);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [accuracyState, dispatchAccuracy] = useReducer(
		accuracyReducer,
		initialAccuracyState
	);

	const initialRgbState = {
		red: '127.5',
		green: '127.5',
		blue: '127.5',
		result: [],
	};
	const [rgbState, setRgbState] = useState(initialRgbState);

	const [base64Color, setBase64Color] = useState({});

	const initSession = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data } = await axios.get('/init-session');
			const colorSequenceArray = [...Object.values(data)];
			setBase64Color(colorSequenceArray[0]);
			setColorSequence(colorSequenceArray.splice(1, colorSequenceArray.length));
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		initSession();
	}, [initSession]);

	const [userAnswerInRgb, setUserAnswerInRgb] = useState([]);
	const [userHasAnswered, setUserHasAnswered] = useState(false);
	useEffect(() => {
		setUserAnswerInRgb([rgbState['red'], rgbState['green'], rgbState['blue']]);
	}, [rgbState]);

	const { red, green, blue } = rgbState;
	useEffect(() => {
		setRgbState(prevRgbState => {
			return {
				...prevRgbState,
				result: [red, green, blue],
			};
		});
	}, [red, green, blue]);

	const resetInputs = () => {
		setRgbState(initialRgbState);
	};

	const endGameAndShowResults = () => {
		setGameIsFinished(true);
		setButtonDisabled(true);
	};

	const getAndSetRgbAccuracy = async () => {
		const { data } = await axios.post('/validate-user-answer', {
			userAnswerInRgb: userAnswerInRgb,
			dictionaryMatchId: base64Color.dictionaryMatchId,
		});
		const { jpegRgbValue, rgbAccuracyArr, accuracyPercentage } = data;
		setBase64Color(base64ColorState => {
			return {
				...base64ColorState,
				rgb: jpegRgbValue,
				accuracy: accuracyPercentage,
			};
		});
		dispatchAccuracy({
			type: 'UPDATE',
			value: {
				percentage: accuracyPercentage,
				individual: rgbAccuracyArr,
			},
		});
	};

	const TIMEOUT_CONSTANT = 4000;
	const submitHandler = async e => {
		e.preventDefault();
		await getAndSetRgbAccuracy();
		setUserHasAnswered(true);
		setButtonDisabled(true);

		setColorsGuessed(prevGuessedColors => {
			return [{ ...base64Color }, ...prevGuessedColors];
		});

		const nextColorInLine = colorSequence[0];
		setTimeout(() => {
			if (!nextColorInLine) return endGameAndShowResults();
			setUserHasAnswered(false);
			resetInputs();
			setButtonDisabled(false);

			setBase64Color(nextColorInLine);
			setColorSequence(colorsInSequence => {
				return colorsInSequence.splice(1, colorsInSequence.length);
			});
		}, TIMEOUT_CONSTANT);
	};

	const convertToValidRgbString = rgbStr => {
		const charStorage = [...rgbStr.toString()];
		while (!charStorage[2]) {
			charStorage.unshift('0');
		}
		return charStorage.join('');
	};

	const inputChangeHandler = e => {
		const { name, value } = e.target;
		const rgbStrPiece =
			value.length < 3 ? convertToValidRgbString(value) : value;
		setRgbState(prevState => {
			return { ...prevState, [name]: rgbStrPiece };
		});
	};

	const resetAccuracyState = () => {
		dispatchAccuracy({ type: 'RESET' });
	};

	const resetState = () => {
		resetInputs();
		resetAccuracyState();
		setColorsGuessed([]);
		setUserAnswerInRgb([]);
		setUserHasAnswered(false);
		setGameIsFinished(false);
		setButtonDisabled(false);
		setRgbState(initialRgbState);
	};

	const restartGame = () => {
		resetState();
		initSession();
	};

	const currentColorElem = (
		<div className='relative h-full'>
			<img
				className='absolute top-0 left-0 w-full h-full'
				src={`data:image/jpeg;base64,${base64Color?.data}`}
				alt=''
			/>

			<div className='absolute grid place-items-center left-0 bottom-0 w-full h-1/2'>
				<CSSTransition
					in={userHasAnswered}
					timeout={TIMEOUT_CONSTANT / 4} // four stages of transition, each 500ms
					classNames='text'
					unmountOnExit
				>
					<h1 className='text-2xl font-bold p-2'>
						{`rgb(${base64Color?.rgb})`}
					</h1>
				</CSSTransition>
			</div>
		</div>
	);

	const creditEl = (
		<footer className='credit grid place-items-center -mx-4 -mb-4 mt-4 bg-gray-100'>
			<span>
				Made with ❤️ by{' '}
				<a
					href='https://www.instagram.com/maxfreakinolson/'
					target='_blank'
					rel='noreferrer'
				>
					@maxfreakinolson
				</a>
			</span>
		</footer>
	);

	const userAnswerBgColor = {
		backgroundColor: userHasAnswered ? `rgb(${userAnswerInRgb})` : null,
	};

	return (
		<React.Fragment>
			{gameIsFinished && (
				<ResultModal
					onRestartGame={restartGame}
					colorsGuessed={colorsGuessed}
					sessionAccuracyArr={accuracyState.combinedSessionAccuracy}
				></ResultModal>
			)}

			{!isLoading && (
				<div className='layout'>
					<ColorSequenceList
						base64ColorObj={base64Color}
						colorSequence={colorSequence}
						widthFull
					/>

					<div className='grid-layout grid-rows-[4fr_1fr_3fr_0.5fr] md:grid-rows-[6fr_1fr_max-content_0.5fr]'>
						<div className='overflow-hidden rounded'>
							<CSSTransition
								in={userHasAnswered}
								timeout={TIMEOUT_CONSTANT / 4} // four stages of transition, each 500ms
								classNames='grid-tilt'
							>
								<div className='grid h-[200%]'>
									{currentColorElem}

									<div className='relative' style={userAnswerBgColor}>
										<div className='absolute grid place-items-center left-0 top-0 w-full h-1/2'>
											<CSSTransition
												in={userHasAnswered}
												timeout={TIMEOUT_CONSTANT / 4} // four stages of transition, each 500ms
												classNames='text'
												unmountOnExit
											>
												<h1 className='text-2xl font-bold p-2'>
													{`rgb(${userAnswerInRgb[0]}, ${userAnswerInRgb[1]}, ${userAnswerInRgb[2]})`}
												</h1>
											</CSSTransition>
										</div>
									</div>
								</div>
							</CSSTransition>
						</div>

						<div className='grid place-items-center'>
							<h1 className='text-6xl font-bold'>
								{/* {correctGuesses}/{SEQUENCE_LENGTH} */}
								{userHasAnswered &&
									`${toFixed(accuracyState.accuracy.percentage, 2)}%`}
							</h1>
						</div>

						<div className='w-full'>
							<form
								className='flex flex-col justify-between gap-4 w-full -px-4'
								onSubmit={submitHandler}
							>
								<div className='container mb-4'>
									<div className='form-control'>
										<RangeInput
											name='red'
											rgbValue={rgbState.red}
											onChange={inputChangeHandler}
											gradientClass={`to-[rgb(255,0,0)]`}
											disabled={buttonDisabled}
										/>
									</div>
									<div className='form-control'>
										<RangeInput
											name='green'
											rgbValue={rgbState.green}
											onChange={inputChangeHandler}
											gradientClass={`to-[rgb(0,255,0)]`}
											disabled={buttonDisabled}
										/>
									</div>
									<div className='form-control'>
										<RangeInput
											name='blue'
											rgbValue={rgbState.blue}
											onChange={inputChangeHandler}
											gradientClass={`to-[rgb(0,0,255)]`}
											disabled={buttonDisabled}
										/>
									</div>
								</div>

								<Button type='submit' disabled={buttonDisabled}>
									answer
								</Button>
							</form>
						</div>
						{creditEl}
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default App;
