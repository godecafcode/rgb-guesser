import React from 'react';

const Modal = props => {
	return (
		<div className='max-w-[750px] px-4 w-full min-h-[50vh] absolute z-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
			<div className='px-4 w-full min-h-[50vh] grid place-items-center bg-white h-inherit'>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
