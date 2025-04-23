import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormGroup, FormControlLabel, Checkbox, Switch } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Nui from '../../util/Nui';
import PedModels from './Ped/peds';

const useStyles = makeStyles((theme) => ({
	nekked: {
		zIndex: 50,
		position: 'absolute',
		bottom: '6.5vh',
		right: '29vh',
		width: 'fit-content',
		margin: 'auto',
		
		background: `${theme.palette.secondary.main}a9`,
		padding: '5px 5px 5px 15px',
		borderRadius: '1vh',
		userSelect: 'none',
		
		transform: 'rotateX(10deg) rotateY(10deg)',
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const isNekked = useSelector((state) => state.app.isNekked);
	const isForced = useSelector((state) => state.app.forcedNekked);
	const gender = useSelector((state) => state.app.gender);
	const model = useSelector((state) => state.app.ped.model);
	const peds = PedModels[gender];
	const curr = peds.indexOf(model) == -1 ? 0 : peds.indexOf(model);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const e = async () => {
			setLoading(true);
			let res = await (
				await Nui.send('ToggleNekked', isNekked || isForced)
			).json();
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		};
		e();
	}, [isNekked, isForced]);

	const onChange = async (e) => {
		try {
			Nui.send('FrontEndSound', { sound: 'SELECT' });
			dispatch({
				type: 'SET_NEKKED',
				payload: { state: !isNekked },
			});
		} catch (err) {}
	};

	return (
		<FormGroup className={classes.nekked}>
			<FormControlLabel
				control={
					<Switch
						checked={isNekked || isForced}
						disabled={isForced || loading || curr != 0}
					/>
				}
				label="Hide Clothes"
				onChange={onChange}
			/>
		</FormGroup>
	);
};
