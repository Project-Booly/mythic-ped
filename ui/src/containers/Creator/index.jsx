import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, IconButton, Button, Tooltip,  } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TabPanel, Dialog } from '../../components/UIComponents';
import { Face } from '../../components';
import { SavePed } from '../../actions/pedActions';
import Body from '../../components/Body/Body';
import Hair from '../../components/Hair/Hair';
import Clothes from '../../components/Clothes/Clothes';
import Tattoo from '../../components/Tattoos';
import Accessories from '../../components/Accessories/Accessories';
import Naked from '../../components/PedComponents/Naked';
import FaceMakeup from '../../components/Face/FaceMakeup/FaceMakeup';
import Wrapper from '../../components/UIComponents/Wrapper/Wrapper';
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

	const [saving, setSaving] = useState(false);
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
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
						centered
						style={{ width: '100%' }}
						value={value}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
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
						<Tooltip title="Makeup" placement='bottom'>
							<Tab label={<FontAwesomeIcon icon={['fas', 'teeth-open']} />} />
						</Tooltip>
						<Tooltip title="Clothing" placement='bottom'>
							<Tab label={<FontAwesomeIcon icon={['fas', 'shirt']} />} />
						</Tooltip>
						<Tooltip title="Accessories" placement='bottom'>
							<Tab label={<FontAwesomeIcon icon={['fas', 'mitten']} />} />
						</Tooltip>
						<Tooltip title = "Tattoo's" placement='bottom'>
							<Tab label={<FontAwesomeIcon icon={['fas', 'atom']} />} />
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
					<TabPanel value={value} index={3}>
						<Wrapper>
							<FaceMakeup />
						</Wrapper>
					</TabPanel>
					<TabPanel value={value} index={4}>
						<Clothes arms/>
					</TabPanel>
					<TabPanel value={value} index={5}>
						<Accessories />
					</TabPanel>
					<TabPanel value={value} index={6}>
						<Tattoo />
					</TabPanel>
				</div>
			</div>

			<Naked />
			<Button
				variant="contained"
				// color="success"
				className={classes.saveBtn}
				onClick={() => setSaving(true)}
			>
				Save Eveything
				<FontAwesomeIcon icon={['fas', 'floppy-disk']} />
			</Button>

			<Dialog
				title="Create Character Ped?"
				open={saving}
				onAccept={onSave}
				onDecline={() => setSaving(false)}
			>
				<p>Are you sure you want to save?</p>
				<p>
					You may not be able to edit some things after this screen,
					ensure you are totally done creating your character before
					you continue!
				</p>
			</Dialog>
		</div>
	);
};
