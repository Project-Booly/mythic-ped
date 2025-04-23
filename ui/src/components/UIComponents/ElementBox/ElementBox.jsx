import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	inner: {
		// background: theme.palette.secondary.main,
		paddingBottom: 0,
		overflow: 'hidden',
		marginBottom: 10,
	},
	header: {
		color: theme.palette.text.main,
		position: 'relative',
		// background: theme.palette.primary.dark,
		padding: 5,
		width: 'fit-content',
		marginBottom: 5,
		fontSize: 12,
		letterSpacing: 2,
		textTransform: 'uppercase',
		whiteSpace: 'nowrap',
		maxWidth: '90%',
		// borderLeft: `1px solid ${theme.palette.border.divider}`,
		// borderRight: `1px solid ${theme.palette.border.divider}`,
		// '&::after': {
		// 	content: '" "',
		// 	position: 'absolute',
		// 	display: 'block',
		// 	transition: 'all 0.5s ease',
		// 	top: 0,
		// 	right: -21,
		// 	width: 0,
		// 	height: 0,
		// 	borderBottom: `38px solid ${theme.palette.primary.dark}`,
		// 	borderRight: '21px solid transparent',
		// },
		userSelect: 'none',
	},
}));

export default (props) => {
	const classes = useStyles();
	return (
		<div className={classes.inner}>
			{Boolean(props.label) && (
				<div className={classes.header}>
					<div
						style={{
							maxWidth: '100%',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{props.label}
					</div>
				</div>
			)}
			<div className={props.bodyClass}>{props.children}</div>
		</div>
	);
};
