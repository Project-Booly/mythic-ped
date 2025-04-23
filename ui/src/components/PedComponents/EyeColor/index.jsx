import React, { useState, useEffect } from 'react';
import ElementBox from '../../UIComponents/ElementBox/ElementBox';
import { makeStyles } from '@mui/styles';
import Nui from '../../../util/Nui';
import { connect } from 'react-redux';
import { Collapse, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
	body: {
		display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
		gap: '10px',
		padding: '10px',
		maxHeight: '100%',
		overflowX: 'hidden',
		overflowY: 'auto',
		margin: '25px auto',
		userSelect: 'none',
		background: 'none',
		transform: 'rotateX(10deg) rotateY(10deg)',
	},
	buttonContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		border: '3px solid transparent',
		padding: 10,
		borderRadius: '.75vh',
		cursor: 'pointer',
		// '&:hover': {
		// 	// background: 'rgba(90, 10, 10, .9)',
		// 	borderColor: 'rgba(69, 5, 5, 1)', 
		// },
	},
	button: {
		width: 80,
		height: 80,
		borderRadius: '50%',
		border: '3px solid transparent', 
		cursor: 'pointer',
		objectFit: 'contain',
		transition: 'border-color 0.3s ease-in-out', 
		'&:focus': {
			outline: 'none',
		},
		'&:hover': {
			borderColor: theme.palette.primary.main,
		},
	},
	selected: {
		background: theme.palette.secondary.main,
		filter: 'grayscale(0.5)',
	},
	label: {
		marginTop: 5,
		textAlign: 'center',
		fontSize: 14,
		color: theme.palette.text.primary,
	},
	toggle: {
		position: 'absolute',
		top: '50%',
		right: 0,
		transform: 'translateY(-50%)',
	},
}));

const EyeColors = [
	'Green', 'Emerald', 'Light Blue', 'Ocean Blue', 'Light Brown', 'Dark Brown',
	'Hazel', 'Dark Grey', 'Light Grey', 'Pink', 'Yellow', 'Purple', 'Blackout',
	'Shades of Gray', 'Teqiila Sunrise', 'Atomic', 'Warp', 'ECola', 'Space Ranger',
	'Ying Yang', 'Bullseye', 'Lizard', 'Dragon', 'Extra Terrestial', 'Goat',
	'Smiley', 'Possessed', 'Demon', 'Infected', 'alien', 'Undead', 'Zombie',
];

const EyeColorSelector = ({ collapsible = true, ...props }) => {
	const classes = useStyles();
	const [loadedImages, setLoadedImages] = useState({});
	const [eyesOpen, setEyesOpen] = useState(true);

	useEffect(() => {
		const loadImages = async () => {
			const images = {};
			for (let i = 0; i < EyeColors.length; i++) {
				try {
					images[i] = await import(`../../../assets/eyes/Eye${i + 1}.png`);
				} catch (error) {
					images[i] = require('../../../assets/fallback.png');
				}
			}
			setLoadedImages(images);
		};
		loadImages();
	}, []);

	const handleClick = (index) => {
		Nui.send('SetPedEyeColor', {
			type: 'drawableId',
			name: props.name,
			value: index,
		});
	};

	return (
		<ElementBox
			label={
				<span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					{props.label}
					<span style={{ fontSize: 12, color: '#888' }}>
						({EyeColors[props.component]})
					</span>
					{collapsible && (
						<Tooltip title={eyesOpen ? 'Click to hide eye color settings' : 'Click to show eye color settings'}>
							<IconButton size="small" onClick={() => setEyesOpen(!eyesOpen)}>
								<FontAwesomeIcon icon={eyesOpen ? 'eye-slash' : 'eye'} />
							</IconButton>
						</Tooltip>
					)}
				</span>
			}
		>
			<Collapse in={eyesOpen}>
				<div className={classes.body}>
					{EyeColors.map((color, index) => (
						<div key={color} className={classes.buttonContainer}>
							{loadedImages[index] && (
								<img
									src={loadedImages[index].default}
									alt={`Eye ${index + 1}`}
									className={`${classes.button} ${props.component === index ? classes.selected : ''}`}
									onClick={() => handleClick(index)}
									disabled={props.disabled}
								/>
							)}
							<div className={classes.label}>{color}</div>
						</div>
					))}
				</div>
			</Collapse>
		</ElementBox>
	);
};

export default connect()(EyeColorSelector);
