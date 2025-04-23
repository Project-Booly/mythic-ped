import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, IconButton, ButtonGroup, Button, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nui from '../../util/Nui';

const useStyles = makeStyles((theme) => ({
	camBar: {
		zIndex: 50,
		position: 'absolute',
		top: 100,
		background: `${theme.palette.secondary.main}a9`,
		height: 'fit-content',
		width: '8vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '1vh 0',
		borderRadius: '1vh',
		
		transform: 'rotateX(10deg) rotateY(10deg)',
	},
	tab: {
		minHeight: '2vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
	},
}));

export default (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const camera = useSelector((state) => state.app.camera);
	const state = useSelector((state) => state.app.state);
	const cost = useSelector((state) => state.app.pricing.SURGERY);
    const [moveOverBwo, setMoveOverBwo] = useState(true);

	const [value, setValue] = useState(0);

	const onCamChange = async (e, newValue) => {
		try {
			let res = await (await Nui.send('ChangeCamera', newValue)).json();

			if (res) {
				dispatch({
					type: 'SET_CAM',
					payload: {
						cam: newValue,
					},
				});
			}
		} catch (err) {}
	};

    useEffect(() => { // btnBar in the tattoos isnt needed so i hid it, and have this to move the camera block div, so you can scroll on panel without it moving the camera.
        if (state === 'TATTOO') {
            setMoveOverBwo(true);
        } else {
            setMoveOverBwo(false);
        }
    }, [state]);

	return (
        <div>
            {/* <div className={classes.camBar} style={{ left: moveOverBwo ? 540 : 580, }}> */}
            <div className={classes.camBar} style={{ right: 500, }}>
                <div style={{ position: 'absolute', top: 10, color: 'lightgray' }}><FontAwesomeIcon icon={['fas', 'camera-retro']} /></div>
                <div style={{ marginTop: 35 }}>
                    <Tabs
                        centered
                        orientation="vertical"
                        style={{ height: '100%', width: '100%' }}
                        value={camera}
                        onChange={onCamChange}
                        indicatorColor="none"
                        textColor="primary"
                    >
                        <Tooltip placement="left" title="Full Camera">
                            <Tab className={classes.tab} icon={<FontAwesomeIcon icon={['fas', 'child-reaching']} />} />
                        </Tooltip>
                        <Tooltip placement="left" title="Face Cam">
                            <Tab className={classes.tab} icon={<FontAwesomeIcon icon={['fas', 'face-grimace']} />} />
                        </Tooltip>
                        <Tooltip placement="left" title="Torso Cam">
                            <Tab className={classes.tab} icon={<FontAwesomeIcon icon={['fas', 'shirt']} />} />
                        </Tooltip>
                        <Tooltip placement="left" title="Feet Cam">
                            <Tab className={classes.tab} icon={<FontAwesomeIcon icon={['fas', 'socks']} />} />
                        </Tooltip>
                    </Tabs>
                </div>
            </div>
        </div>
	);
};
