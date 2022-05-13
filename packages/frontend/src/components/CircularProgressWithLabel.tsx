import Box from '@mui/material/Box';
import CircularProgress, {
  CircularProgressProps
} from '@mui/material/CircularProgress';

export const CircularProgressWithLabel = (
  props: CircularProgressProps & { value: number },
) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="text-violet-400 text-sm">{Math.round(props.value)}%</span>
      </Box>
    </Box>
  );
}
