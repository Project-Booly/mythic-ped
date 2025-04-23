import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  declineButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
      borderColor: theme.palette.error.main,
      color: 'white',
    },
  },
  acceptButton: {
	  color: 'white',
    backgroundColor: 'rgba(82, 152, 74)',
    '&:hover': {
      backgroundColor: 'rgba(82, 152, 74, .69)',
    },
  },
}));

export default ({
  open,
  title,
  onAccept,
  onDecline,
  children,
  declineLang = 'Cancel',
  acceptLang = 'Save',
}) => {
  const classes = useStyles();

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle style={{ userSelect: 'none' }}>{title}</DialogTitle>
      <DialogContent  style={{ userSelect: 'none' }}>{children}</DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          className={classes.declineButton}
          onClick={onDecline}
        >
          {declineLang}
        </Button>
        <Button
          variant="contained"
          className={classes.acceptButton}
          onClick={onAccept}
        >
          {acceptLang}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
