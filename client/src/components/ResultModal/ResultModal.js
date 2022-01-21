import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../UI/Button';
import ColorSequenceList from '../ColorSequenceList';

const Backdrop = () => {
	return (
		<div className='w-screen h-screen bg-black absolute top-0 left-0 z-40 opacity-60 grid place-items-center'></div>
	);
};

const ModalOverlay = props => {
	return (
		<div className='max-w-[750px] px-4 w-full min-h-[50vh] absolute z-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
			<div className='px-4 w-full min-h-[50vh] grid place-items-center bg-white h-inherit'>
				<div className='container grid place-items-center'>
					<h2 className='text-4xl uppercase font-bold'>final score</h2>
					<h1 className='final-score text-8xl font-bold'>
						{/* <span>🎉</span> */}
						{props.finalScore}
						{/* <span>🎉</span> */}
					</h1>
				</div>
				<div className='slider overflow-x-scroll rounded-none h-max border-2 border-black'>
					<ColorSequenceList colorSequence={props.colorsGuessed} widthFull />
				</div>
				<Button type='button' onClick={props.onRestartGame}>
					try again
				</Button>
			</div>
		</div>
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
					finalScore={props.finalScore}
					colorsGuessed={props.colorsGuessed}
					onRestartGame={props.onRestartGame}
				/>,
				document.getElementById('modal-root')
			)}
		</React.Fragment>
	);
};

export default ResultModal;
