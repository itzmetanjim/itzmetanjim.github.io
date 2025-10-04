import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import { useState } from 'react';

// Import our example components
import ButtonsExample from './components/ButtonsExample';
import CardsExample from './components/CardsExample';
import FormsExample from './components/FormsExample';
import DataDisplayExample from './components/DataDisplayExample';
import NavigationExample from './components/NavigationExample';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Material-UI Example Project
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom align="center">
            Material-UI Components Showcase
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
            Explore various Material-UI components and their usage
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="component examples">
              <Tab label="Buttons" />
              <Tab label="Cards" />
              <Tab label="Forms" />
              <Tab label="Data Display" />
              <Tab label="Navigation" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <ButtonsExample />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CardsExample />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <FormsExample />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <DataDisplayExample />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <NavigationExample />
          </TabPanel>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;