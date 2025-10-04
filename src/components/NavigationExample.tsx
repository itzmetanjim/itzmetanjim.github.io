import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Breadcrumbs,
  Link,
  BottomNavigation,
  BottomNavigationAction,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Pagination,
  Menu,
  MenuItem,
  MenuList,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Restore as RestoreIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
  Folder as FolderIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const steps = [
  {
    label: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Create an ad group',
    description: 'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems, you can reach out to our helpful support team.`,
  },
];

export default function NavigationExample() {
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [page, setPage] = useState(1);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleBottomNavChange = (_event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const speedDialActions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Navigation Examples
      </Typography>

      <Stack spacing={4}>
        {/* Breadcrumbs */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Breadcrumbs
          </Typography>
          <Stack spacing={2}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="/products">
                Products
              </Link>
              <Typography color="text.primary">Electronics</Typography>
            </Breadcrumbs>
            
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link>
              <Link underline="hover" color="inherit" href="/catalog">
                Catalog
              </Link>
              <Link underline="hover" color="inherit" href="/accessories">
                Accessories
              </Link>
              <Typography color="text.primary">Keyboards</Typography>
            </Breadcrumbs>
          </Stack>
        </Paper>

        {/* Stepper */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Stepper Navigation
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={index === steps.length - 1}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </Paper>

        {/* Pagination */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pagination
          </Typography>
          <Stack spacing={3} alignItems="center">
            <Pagination
              count={10}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
            <Pagination
              count={10}
              page={page}
              onChange={handlePageChange}
              color="secondary"
              variant="outlined"
            />
            <Pagination
              count={10}
              page={page}
              onChange={handlePageChange}
              size="large"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Paper>

        {/* Menu */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={handleMenuClick}
              endIcon={<AccountCircleIcon />}
            >
              Open Menu
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <FolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Files</ListItemText>
              </MenuItem>
            </Menu>

            <MenuList sx={{ mt: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <MenuItem>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Duplicate</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ShareIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Share</ListItemText>
              </MenuItem>
            </MenuList>
          </Box>
        </Paper>

        {/* Bottom Navigation */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bottom Navigation
          </Typography>
          <Paper sx={{ position: 'relative', width: '100%', maxWidth: 500, mx: 'auto' }} elevation={3}>
            <BottomNavigation
              value={bottomNavValue}
              onChange={handleBottomNavChange}
              showLabels
            >
              <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
              <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
              <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
              <BottomNavigationAction label="Folder" icon={<FolderIcon />} />
            </BottomNavigation>
          </Paper>
        </Paper>

        {/* Speed Dial */}
        <Paper sx={{ p: 3, position: 'relative', height: 300 }}>
          <Typography variant="h6" gutterBottom>
            Speed Dial
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Check the bottom right corner for the Speed Dial component
          </Typography>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial>
        </Paper>
      </Stack>
    </Box>
  );
}