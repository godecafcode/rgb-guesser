import React from 'react';

import ColorSequenceListItem from './ColorSequenceListItem';

const CurrentColor = props => {
	return (
		<li
			className={
				'min-w-[4rem] min-h-[4rem] mr-4 grid place-items-center rounded relative border-black border-2'
			}
		>
			<img
				className='object-contain'
				src={`data:image/jpeg;base64,${props.base64ColorData}`}
				alt=''
			/>
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
			<ul className='flex flex-row  px-4 items-center '>
				<CurrentColor base64ColorData={props.base64ColorData} />

				{props.colorSequence.map((color, idx) => (
					<ColorSequenceListItem key={idx} color={color} />
				))}
			</ul>
		</div>
	);
};

export default ColorSequenceList;
