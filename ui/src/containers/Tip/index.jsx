import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		height: 'fit-content',
		width: 'fit-content',
		background: `${theme.palette.secondary.dark}a2`,
		position: 'fixed',
		bottom: 10,
		left: 10,
		padding: 2,
		fontSize: 18,
		borderRadius: '.5vh',
		userSelect: 'none',
		// transform: 'rotateX(-15deg) rotateY(-15deg)',
	},
	text: {
		color: theme.palette.text.main,
		padding: 14,
		fontSize: 16,
		letterSpacing: 1,
		textTransform: 'uppercase',
		whiteSpace: 'nowrap',
		display: 'flex',
		flexDirection: 'row',
		gap: '10px',
	},
	key: {
		background: `${theme.palette.primary.main}a2`,
		color: 'white',
		border: `2px solid ${theme.palette.primary.main}a2`,
		padding: '6px 12px',
		borderRadius: '4px',
		marginRight: 5
	},
}));

export default (props) => {
	const classes = useStyles();

	return (
		<div className={classes.wrapper}>
			<div className={classes.text}>
				<div>
					<span className={classes.key}>Q</span>
					<span>{`/ `}</span>
					<span className={classes.key}>E</span>Rotate
				</div>
				<div>
					<span className={classes.key}>Mousewheel</span>Zoom
				</div>
				<div>
					<span className={classes.key}>R</span>Animation
				</div>
				<div>
					<span className={classes.key}>G</span>Spotlight
				</div>
			</div>
		</div>
	);
};
