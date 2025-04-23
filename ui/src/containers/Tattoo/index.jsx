import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, ButtonGroup, Button, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TabPanel, Dialog } from '../../components/UIComponents';
import { CurrencyFormat } from '../../util/Parser';
import { SavePed, CancelEdits } from '../../actions/pedActions';
import Tattoo from '../../components/Tattoos';
import Naked from '../../components/PedComponents/Naked';
import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		width: 450,
		position: 'absolute',
		right: 20,
		top: '5vh',
		transform: 'rotateX(10deg) rotateY(10deg)',
		height: 'calc(100vh - 200px)',
		background: `${theme.palette.secondary.main}a4`,
		borderRadius: '1vh',
		overflow: 'hidden',
	},
	errorBtn: {
		position: 'absolute',
		top: '1vh',
		right: '2.25vh',
		color: 'white',
		background: `${theme.palette.primary.main}a2`,
		border: `2px solid ${theme.palette.primary.main}a2`,
		borderRadius: '4px',
		color: 'white',
		'&:hover': {
			background: `${theme.palette.primary.main}a2`,
			filter: 'brightness(0.75)',
		},
		padding: '10px 12px',
	},
	saveBtn: {
		position: 'absolute',
		bottom: '6vh',
		right: '2.25vh',
		color: 'white',
		background: `${theme.palette.success.main}a2`,
		border: `2px solid ${theme.palette.success.main}a2`,
		borderRadius: '4px',
		transform: 'rotateX(10deg) rotateY(10deg)',
		transition: 'filter ease-in 0.15s',
		'& svg': {
			marginLeft: 6,
		},
		'&:hover': {
			background: `${theme.palette.success.main}a2`,
			filter: 'brightness(0.75)',
		},
	},
	panel: {
		width: 450,
		position: 'relative',
		left: 0,
		top: 10,
		height: 'calc(100vh - 180px)',
		overflow: 'hidden'
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const state = useSelector((state) => state.app.state);
	const cost = useSelector(state => state.app.pricing.TATTOO);

	const [cancelling, setCancelling] = useState(false);
	const [saving, setSaving] = useState(false);
	const [value, setValue] = useState(0);

	const onCancel = () => {
		setCancelling(false);
		dispatch(CancelEdits());
	};

	const onSave = () => {
		setSaving(false);
		dispatch(SavePed(state));
	};

	return (
		<div>
			<div className={classes.wrapper}>
				<div className={classes.panel}>
					<TabPanel value={value} index={0}>
						<Tattoo />
					</TabPanel>
				</div>
			</div>

			<Naked />
			
			<Button onClick={() => setCancelling(true)} className={classes.errorBtn}>
				<FontAwesomeIcon icon={['fas', 'x']} />
			</Button>
			
			<Button size='large' onClick={() => setSaving(true)} className={classes.saveBtn}>
				Save Everything
				<FontAwesomeIcon icon={['fas', 'floppy-disk']} />
			</Button>

			<Dialog
				title="Cancel?"
				open={cancelling}
				onAccept={onCancel}
				onDecline={() => setCancelling(false)}
				acceptLang="Yes"
				declineLang="No"
			>
				<p>
					All changes will be discarded, are you sure you want to
					continue?
				</p>
			</Dialog>
			<Dialog
				title="Save Tattoos?"
				open={saving}
				onAccept={onSave}
				onDecline={() => setSaving(false)}
			>
				<p>
					You will be charged{' '}
					<span className={classes.highlight}>
						{CurrencyFormat.format(cost)}
					</span>
					?
				</p>
				<p>Are you sure you want to save?</p>
			</Dialog>
		</div>
	);
};
