import React from 'react';
import { roundToNearestInt } from '../../utils';
import ColorSequenceListItem from './ColorSequenceListItem';

const CurrentColor = props => {
	const conditionalContent = props.userAnswerAccuracy ? (
		<h1 className='bg-white rounded'>
			{roundToNearestInt(props.userAnswerAccuracy)}%
		</h1>
	) : (
		<h1 className='text-3xl'>🤔</h1>
	);
	return (
		<li
			className={
				'w-[4rem] h-[4rem] mr-4 grid place-items-center rounded relative border-black border-2'
			}
		>
			<img
				className='object-fill'
				src={`data:image/jpeg;base64,${props.base64ColorData}`}
				alt=''
			/>

			<span className='text-2xl text-black font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
				{conditionalContent}
			</span>
			{/* {props.currentColor?.isCorrect === null && (
				<span className='text-3xl'>🤔</span>
			)}
			{props.currentColor?.isCorrect === true && (
				<span className='text-3xl'>✔️</span>
			)}
			{props.currentColor?.isCorrect === false && (
				<span className='text-3xl'>❌</span>
			)} */}
		</li>
	);
};

const ColorSequenceList = props => {
	return (
		<div
			className={`${
				props.widthFull ? 'w-full' : 'w-screen'
			} h-24 bg-slate-300 flex items-center overflow-x-auto scrollable-mobile`}
		>
			<ul className='flex flex-row px-4 items-center '>
				<CurrentColor
					base64ColorData={props.base64ColorObj.data}
					userAnswerAccuracy={props.base64ColorObj.accuracy}
				/>

				{props.colorSequence.map((color, idx) => (
					<ColorSequenceListItem key={idx} color={color} />
				))}
			</ul>
		</div>
	);
};

export default ColorSequenceList;
