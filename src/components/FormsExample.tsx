import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Typography,
  Paper,
  Stack,
  Switch,
  Slider,
  Rating,
  Autocomplete,
} from '@mui/material';
import { useState } from 'react';

const currencies = [
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
  { value: 'BTC', label: '฿' },
  { value: 'JPY', label: '¥' },
];

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Australia',
  'Brazil',
];

export default function FormsExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    currency: '',
    gender: '',
    notifications: false,
    newsletter: true,
    volume: 30,
    rating: 0,
    country: null as string | null,
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSliderChange = (field: string) => (event: any, value: number | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (field: string) => (event: any, value: number | null) => {
    setFormData(prev => ({ ...prev, [field]: value || 0 }));
  };

  const handleAutocompleteChange = (field: string) => (event: any, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form data:', formData);
    alert('Form submitted! Check the console for data.');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Forms Examples
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Text Fields */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Text Fields
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                helperText="We'll never share your email"
              />
              <TextField
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={formData.message}
                onChange={handleInputChange('message')}
                placeholder="Tell us about your experience..."
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Standard"
                  variant="standard"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                />
                <TextField
                  label="Filled"
                  variant="filled"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                />
                <TextField
                  label="Outlined"
                  variant="outlined"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                />
              </Stack>
            </Stack>
          </Paper>

          {/* Select Fields */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Fields
            </Typography>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={handleSelectChange('currency')}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label} - {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                options={countries}
                value={formData.country}
                onChange={handleAutocompleteChange('country')}
                renderInput={(params) => (
                  <TextField {...params} label="Country" variant="outlined" />
                )}
                fullWidth
              />
            </Stack>
          </Paper>

          {/* Radio Groups */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Radio Groups
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                value={formData.gender}
                onChange={handleInputChange('gender')}
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
                <FormControlLabel value="prefer-not-to-say" control={<Radio />} label="Prefer not to say" />
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Checkboxes and Switches */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Checkboxes & Switches
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.notifications}
                    onChange={handleInputChange('notifications')}
                  />
                }
                label="Enable notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.newsletter}
                    onChange={handleInputChange('newsletter')}
                  />
                }
                label="Subscribe to newsletter"
              />
            </FormGroup>
          </Paper>

          {/* Sliders and Rating */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sliders & Rating
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography gutterBottom>Volume: {formData.volume}</Typography>
                <Slider
                  value={formData.volume}
                  onChange={handleSliderChange('volume')}
                  aria-labelledby="volume-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={100}
                />
              </Box>
              <Box>
                <Typography component="legend">Rate your experience</Typography>
                <Rating
                  value={formData.rating}
                  onChange={handleRatingChange('rating')}
                  size="large"
                />
              </Box>
            </Stack>
          </Paper>

          {/* Submit Button */}
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button type="submit" variant="contained" size="large">
                Submit Form
              </Button>
              <Button type="reset" variant="outlined" size="large">
                Reset
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </form>
    </Box>
  );
}