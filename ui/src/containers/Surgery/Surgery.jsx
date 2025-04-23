import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, IconButton, ButtonGroup, Button, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TabPanel, Dialog } from '../../components/UIComponents';
import { Face } from '../../components';
import { CurrencyFormat } from '../../util/Parser';
import { SavePed, CancelEdits } from '../../actions/pedActions';
import Body from '../../components/Body/Body';
import Hair from '../../components/Hair/Hair';
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
	btnBar: {
		position: 'relative',
		background: `${theme.palette.secondary.light}a10`,
		width: 450,
		height: 'fit-content',
		marginBottom: '1vh'
	},
	panel: {
		width: 450,
		position: 'relative',
		left: 0,
		top: 0,
		height: 'calc(100vh - 240px)',
		overflow: 'hidden'
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const state = useSelector((state) => state.app.state);
	const cost = useSelector((state) => state.app.pricing.SURGERY);

	const [cancelling, setCancelling] = useState(false);
	const [saving, setSaving] = useState(false);
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

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
				<div className={classes.btnBar}>
					<Tabs
						// orientation="vertical"
						centered
						style={{ width: '100%' }}
						value={value}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
					>
						<Tooltip title="Face" placement='bottom'>
							<Tab label={ <FontAwesomeIcon icon={['fas', 'face-grimace']} /> } />
						</Tooltip>
						<Tooltip title="Body/Ped" placement='bottom'>
							<Tab label={ <FontAwesomeIcon icon={['fas', 'child-reaching']} /> } />
						</Tooltip>
						<Tooltip title="Hair Styles" placement='bottom'>
							<Tab label={<FontAwesomeIcon icon={['fas', 'scissors']} />} />
						</Tooltip>
					</Tabs>
				</div>
				<div className={classes.panel}>
					<TabPanel value={value} index={0}>
						<Face />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Body />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Hair />
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
				title="Save?"
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
