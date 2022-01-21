import React from 'react';

const ScrollableList = props => {
	return (
		<div className='slider overflow-x-scroll rounded-none h-max border-2 border-black'>
			<div className='w-full h-24 bg-slate-300 flex items-center overflow-x-auto scrollable-mobile'>
				<ul className='flex flex-row px-4 items-center '>{props.children}</ul>
			</div>
		</div>
	);
};

export default ScrollableList;
