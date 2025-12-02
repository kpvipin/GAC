import { Box, Button } from '@mui/material';

const SwipeButton = ({ onSwipe, label, disabled, color }) => {
    return (
        <Box>
            <Button
                onClick={onSwipe}
                disabled={disabled}
                color={color}
                fullWidth
                disableElevation
                variant="contained"
                size="large"
            >
                {label}
            </Button>
        </Box >);
};

export default SwipeButton;