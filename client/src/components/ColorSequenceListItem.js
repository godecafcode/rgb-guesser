import React from 'react';

const ColorSequenceListItem = ({ color, textContent }) => {
	return (
		<li
			className={
				'min-w-[3.5rem] min-h-[3.5rem] mr-4 grid place-items-center rounded relative border-black border-2'
			}
		>
			<img
				className='object-contain'
				src={`data:image/jpeg;base64,${color.data}`}
				alt=''
			/>
			<span className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
				{color.isCorrect !== null ? (color.isCorrect ? '✔️' : '❌') : '❔'}
			</span>
		</li>
	);
};

export default ColorSequenceListItem;
