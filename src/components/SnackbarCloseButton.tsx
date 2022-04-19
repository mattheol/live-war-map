import IconClose from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';

function SnackbarCloseButton({ snackbarKey }: { snackbarKey?: SnackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <IconClose />
    </IconButton>
  );
}

export default SnackbarCloseButton;
