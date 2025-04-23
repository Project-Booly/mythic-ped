import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, ButtonGroup, Button, Tooltip, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TabPanel, Dialog } from '../../components/UIComponents';
import { CurrencyFormat } from '../../util/Parser';
import { SavePed, CancelEdits, SaveImport } from '../../actions/pedActions';
import Clothes from '../../components/Clothes/Clothes';
import Accessories from '../../components/Accessories/Accessories';
import Body from '../../components/Body/Body';
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
	importBtn: {
		position: 'absolute',
		top: '2vh',
		left: '2.25vh',
		color: 'white',
		background: `${theme.palette.primary.main}a2`,
		border: `2px solid ${theme.palette.primary.main}a2`,
		borderRadius: '4px',
		transform: 'rotateX(-5deg) rotateY(10deg)',
		transition: 'filter ease-in 0.15s',
		'& svg': {
			marginLeft: 6,
		},
		'&:hover': {
			background: `${theme.palette.primary.main}a2`,
			filter: 'brightness(0.75)',
		},
		zIndex: 999
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
		marginBottom: '.5vh'
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
	const cost = useSelector((state) => state.app.pricing.SHOP);

	const [cancelling, setCancelling] = useState(false);
	const [saving, setSaving] = useState(false);
	const [value, setValue] = useState(0);
	const [importCode, setImportCode] = useState('');
	const [outfitName, setOutfitName] = useState('');

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

	const handleImport = () => {
	  setImportCode('');
	  setOpenImportDialog(true);
	};
  
	const handleImportDialogClose = () => {
	  setOpenImportDialog(false);
	};
  
	const handleImportCodeChange = (event) => {
	  setImportCode(event.target.value);
	};
  
	const handleOutfitNameChange = (event) => {
	  setOutfitName(event.target.value);
	};
  
	const handleImportConfirm = () => {
	  setOpenImportDialog(false);
	  dispatch(SaveImport(outfitName, importCode));
	};
  
	const [openImportDialog, setOpenImportDialog] = useState(false);

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
						variant="fullWidth"
					>
						<Tab label="Clothing" icon={ <FontAwesomeIcon icon={['fas', 'shirt']} /> } />
						<Tab label="Accessories" icon={<FontAwesomeIcon icon={['fas', 'mitten']} />} />
					</Tabs>
				</div>
				<div className={classes.panel}>
					<TabPanel value={value} index={0}>
						<Clothes arms/>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Accessories />
					</TabPanel>
				</div>
			</div>

			<Naked />
			
			<Button onClick={() => setCancelling(true)} className={classes.errorBtn}>
				<FontAwesomeIcon icon={['fas', 'x']} />
			</Button>
			
			<Button size='large' onClick={handleImport} className={classes.importBtn}>
				Import Outfit
				<FontAwesomeIcon icon={['fas', 'file-import']} />
			</Button>
			
			<Button size='large' onClick={() => setSaving(true)} className={classes.saveBtn}>
				Save Everything
				<FontAwesomeIcon icon={['fas', 'floppy-disk']} />
			</Button>

			<Dialog
				open={openImportDialog}
				onClose={handleImportDialogClose}
				title="Import Code"
				onAccept={handleImportConfirm}
				onDecline={handleImportDialogClose}
				acceptText="Import"
				declineText="Cancel"
			>
				<TextField
					autoFocus
					required
					margin="dense"
					id="outfit-name"
					label="Input Outfit Name"
					type="text"
					fullWidth
					value={outfitName}
					onChange={handleOutfitNameChange}
				/>
				<TextField
					required
					margin="dense"
					id="import-code"
					label="Input Outfit Code"
					type="text"
					fullWidth
					value={importCode}
					onChange={handleImportCodeChange}
				/>
			</Dialog>

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
				title="Save Outfit?"
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
