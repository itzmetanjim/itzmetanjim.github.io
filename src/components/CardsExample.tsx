//import React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  CardHeader,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const ExpandMore = styled((props: { expand: boolean } & any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function CardsExample() {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cards Examples
      </Typography>

      <Grid container spacing={4}>
        {/* Simple Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Simple Card
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Basic Example
              </Typography>
              <Typography variant="body2">
                This is a simple card with just content. It demonstrates the basic
                structure of a Material-UI card component.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card with Media */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardMedia
              sx={{ height: 140 }}
              image="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=300&h=140&fit=crop"
              title="Breakfast"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Breakfast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Delicious breakfast items including fruits, cereals, and beverages
                to start your day right.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Complex Card with Avatar */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe">
                  R
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title="Recipe Card"
              subheader="September 14, 2023"
            />
            <CardMedia
              component="img"
              height="194"
              image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=194&fit=crop"
              alt="Food"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                This impressive recipe card shows how to combine multiple Material-UI
                components to create a rich, interactive experience.
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>Method:</Typography>
                <Typography paragraph>
                  Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
                  aside for 10 minutes.
                </Typography>
                <Typography paragraph>
                  Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
                  medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
                  occasionally until lightly browned, 6 to 8 minutes.
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Outlined Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                Outlined Card
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Variant Example
              </Typography>
              <Typography variant="body2">
                This card uses the outlined variant which gives it a different
                visual appearance with a border instead of elevation.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined">
                Action
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Paper Card Alternative */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" component="div" gutterBottom>
              Paper Component
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Alternative Layout
            </Typography>
            <Typography variant="body2" paragraph>
              Sometimes you might want to use the Paper component instead of Card
              for more custom layouts and styling options.
            </Typography>
            <Button variant="contained" size="small">
              Custom Action
            </Button>
          </Paper>
        </Grid>

        {/* Action Area Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&h=140&fit=crop"
              alt="Technology"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Technology
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore the latest in technology trends, gadgets, and innovations
                that are shaping our digital future.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}