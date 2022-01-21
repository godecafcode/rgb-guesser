import React from 'react';

const Button = props => {
	return (
		<button
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}
			className='w-full bg-green-400 border-2 min-h-[55px] border-black uppercase text-black font-bold rounded text-xl'
			style={{ opacity: props.disabled ? '.6' : '1' }}
		>
			{props.children}
		</button>
	);
};

export default Button;
