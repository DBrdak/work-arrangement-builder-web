import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#FFC809',
    },
    secondary: {
      main: '#F19FC4',
    },
  },
  components: {
    MuiButton: {

    },
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '10px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#f5f5f5',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '15px',
          '&:hover': {
            backgroundColor: '#555',
          },
        },
      },
    },
  },
});

export default theme;