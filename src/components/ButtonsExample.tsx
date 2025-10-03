import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Fab,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useState } from 'react';

export default function ButtonsExample() {
  const [alignment, setAlignment] = useState<string | null>('left');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Buttons Examples
      </Typography>

      <Stack spacing={4}>
        {/* Basic Buttons */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Buttons
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
            <Button variant="contained" disabled>
              Disabled
            </Button>
          </Stack>
        </Paper>

        {/* Button Colors */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Button Colors
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button variant="contained" color="primary">
              Primary
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
            <Button variant="contained" color="warning">
              Warning
            </Button>
            <Button variant="contained" color="info">
              Info
            </Button>
          </Stack>
        </Paper>

        {/* Button Sizes */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Button Sizes
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <Button variant="contained" size="small">
              Small
            </Button>
            <Button variant="contained" size="medium">
              Medium
            </Button>
            <Button variant="contained" size="large">
              Large
            </Button>
          </Stack>
        </Paper>

        {/* Buttons with Icons */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Buttons with Icons
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button variant="contained" startIcon={<DeleteIcon />}>
              Delete
            </Button>
            <Button variant="contained" endIcon={<ShareIcon />}>
              Share
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Download
            </Button>
          </Stack>
        </Paper>

        {/* Icon Buttons */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Icon Buttons
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="edit" color="primary">
              <EditIcon />
            </IconButton>
            <IconButton aria-label="favorite" color="secondary">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share" disabled>
              <ShareIcon />
            </IconButton>
          </Stack>
        </Paper>

        {/* Floating Action Buttons */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Floating Action Buttons
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
            <Fab color="secondary" aria-label="edit">
              <EditIcon />
            </Fab>
            <Fab variant="extended">
              <FavoriteIcon sx={{ mr: 1 }} />
              Like
            </Fab>
          </Stack>
        </Paper>

        {/* Button Groups */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Button Groups
          </Typography>
          <Stack spacing={2}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Stack>
        </Paper>

        {/* Toggle Buttons */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Toggle Buttons
          </Typography>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="left" aria-label="left aligned">
              Left
            </ToggleButton>
            <ToggleButton value="center" aria-label="centered">
              Center
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned">
              Right
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Stack>
    </Box>
  );
}