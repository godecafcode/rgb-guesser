import React from 'react';

const RangeInput = ({ name, rgbValue, gradientClass, onChange, disabled }) => {
	return (
		<React.Fragment>
			<label htmlFor={name} className='uppercase'>
				{name[0]}({rgbValue})
			</label>
			<input
				type='range'
				step='1'
				min='0'
				max='255'
				name={name}
				value={rgbValue}
				onChange={onChange}
				disabled={disabled}
				className={`slider bg-gradient-to-r from-black ${gradientClass}`}
			/>
		</React.Fragment>
	);
};

export default RangeInput;
