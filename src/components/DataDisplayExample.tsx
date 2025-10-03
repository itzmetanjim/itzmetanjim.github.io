import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Divider,
  Badge,
  Tooltip,
  LinearProgress,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Work as WorkIcon,
  BeachAccess as BeachAccessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  avatar: string;
  projects: number;
  completion: number;
}

const employees: Employee[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    department: 'Engineering',
    status: 'active',
    avatar: 'AJ',
    projects: 3,
    completion: 85,
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    department: 'Design',
    status: 'vacation',
    avatar: 'BS',
    projects: 2,
    completion: 92,
  },
  {
    id: 3,
    name: 'Carol Wilson',
    email: 'carol@example.com',
    department: 'Marketing',
    status: 'active',
    avatar: 'CW',
    projects: 4,
    completion: 78,
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    department: 'Engineering',
    status: 'inactive',
    avatar: 'DB',
    projects: 1,
    completion: 45,
  },
];

const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status) {
    case 'active':
      return 'success';
    case 'vacation':
      return 'warning';
    case 'inactive':
      return 'error';
    default:
      return 'default';
  }
};

const contacts = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'JD',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    avatar: 'JS',
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 (555) 456-7890',
    avatar: 'MJ',
  },
];

export default function DataDisplayExample() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Display Examples
      </Typography>

      <Stack spacing={4}>
        {/* Table */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Employee Table
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Projects</TableCell>
                  <TableCell align="right">Completion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {employee.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={getStatusColor(employee.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Badge badgeContent={employee.projects} color="primary">
                        <WorkIcon />
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={employee.completion}
                          sx={{ width: 100 }}
                        />
                        <Typography variant="body2">
                          {employee.completion}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Lists */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contact List
          </Typography>
          <List>
            {contacts.map((contact, index) => (
              <React.Fragment key={contact.name}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {contact.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name}
                    secondary={
                      <Box component="span">
                        <Typography component="span" variant="body2" color="text.primary">
                          {contact.email}
                        </Typography>
                        {` — ${contact.phone}`}
                      </Box>
                    }
                  />
                </ListItem>
                {index < contacts.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* List with Icons */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Send Email"
                secondary="Compose and send a new email message"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Make a Call"
                secondary="Start a voice or video call"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Share Location"
                secondary="Share your current location with others"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Progress Indicators */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Progress Indicators
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Linear Progress
              </Typography>
              <Stack spacing={2}>
                <LinearProgress />
                <LinearProgress variant="determinate" value={25} />
                <LinearProgress variant="determinate" value={50} />
                <LinearProgress variant="determinate" value={75} />
                <LinearProgress variant="determinate" value={100} />
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Circular Progress
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress />
                <CircularProgress variant="determinate" value={25} />
                <CircularProgress variant="determinate" value={50} />
                <CircularProgress variant="determinate" value={75} />
                <CircularProgress variant="determinate" value={100} />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Badges and Tooltips */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Badges & Tooltips
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap" useFlexGap>
            <Tooltip title="You have 4 new messages">
              <Badge badgeContent={4} color="primary">
                <EmailIcon />
              </Badge>
            </Tooltip>
            <Tooltip title="Vacation mode">
              <Badge badgeContent="!" color="warning">
                <BeachAccessIcon />
              </Badge>
            </Tooltip>
            <Tooltip title="Work in progress">
              <Badge badgeContent={99} color="secondary">
                <WorkIcon />
              </Badge>
            </Tooltip>
            <Tooltip title="This is a helpful tooltip">
              <Badge variant="dot" color="error">
                <EmailIcon />
              </Badge>
            </Tooltip>
          </Stack>
        </Paper>

        {/* Chips */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Chips
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="Default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Error" color="error" />
            <Chip label="Warning" color="warning" />
            <Chip label="Info" color="info" />
            <Chip label="Outlined" variant="outlined" />
            <Chip label="Deletable" onDelete={() => {}} />
            <Chip label="Clickable" onClick={() => {}} />
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}