import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { EyeColor } from '../PedComponents';

export default (props) => {
	const ped = useSelector((state) => state.app.ped);

	return (
		<div style={{ height: '100%' }}>
			<EyeColor
				label={'Eye Color'}
				component={ped.customization.eyeColor}
				collapsible={false}
			/>
		</div>
	);
};
