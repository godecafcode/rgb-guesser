import React from 'react';
import ReactDOM from 'react-dom';

import { toFixed } from '../../utils';

import Button from '../UI/Button';
import Modal from '../UI/Modal';
import ScrollableList from '../UI/ScrollableList';
import ColorSequenceListItem from '../ColorSequence/ColorSequenceListItem';

const Backdrop = () => {
	return (
		<div className='w-screen h-screen bg-black absolute top-0 left-0 z-40 opacity-60 grid place-items-center'></div>
	);
};

const ModalOverlay = props => {
	const { colorsGuessed, onRestartGame, sessionAccuracyArr } = props;
	const sessionAccuracy = () => {
		return (
			sessionAccuracyArr.reduce((n1, n2) => n1 + n2) / colorsGuessed.length
		);
	};
	return (
		<Modal>
			<div className='container grid place-items-center'>
				<h2 className='text-3xl uppercase font-bold mb-4'>session accuracy</h2>
				<h1 className='final-score text-8xl font-bold'>
					{`${toFixed(sessionAccuracy())}%`}
				</h1>
			</div>
			<ScrollableList>
				{colorsGuessed.map((base64Color, idx) => (
					<ColorSequenceListItem key={idx} color={base64Color} />
				))}
			</ScrollableList>
			<Button type='button' onClick={onRestartGame}>
				try again
			</Button>
		</Modal>
	);
};

const ResultModal = props => {
	return (
		<React.Fragment>
			{ReactDOM.createPortal(
				<Backdrop />,
				document.getElementById('backdrop-root')
			)}
			{ReactDOM.createPortal(
				<ModalOverlay
					colorsGuessed={props.colorsGuessed}
					onRestartGame={props.onRestartGame}
					sessionAccuracyArr={props.sessionAccuracyArr}
				/>,
				document.getElementById('modal-root')
			)}
		</React.Fragment>
	);
};

export default ResultModal;
