import { useState } from "react";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const Instructions = ({ goals }: { goals: string[] }) => {
  const totalGoals = 25;

  // show the final list
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(true)
  };  

  if (goals.length === 0) {
    return (
      <div>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          Let's come up with {totalGoals} things you want to do or accomplish.
        </Typography>
        <Typography variant="body2">
          For example: visit Japan, learn Spanish or get promoted to village chief.
          <br/>
          Let your imagination run wild.
        </Typography>
      </div>
    );
  }

  if (goals.length < totalGoals) {
    return (
      <div>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          We're getting there!
        </Typography>
        <Typography variant="body2">
          We need {totalGoals-goals.length} more goals! Keep adding!
        </Typography>
      </div>
    );
  }

  if (!show) {
    return (
      <div>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          Let's prioritize
        </Typography>
        <Typography variant="body2" gutterBottom>
          You've got {totalGoals}, well done! Now order them by placing the goals you want to focus on first.
        </Typography>

        <Typography variant="body2" gutterBottom>
          Press done when you are happy with the list order.
        </Typography>

        <Button type="submit" variant="outlined" onClick={handleClick}>Done!</Button>
      </div>
    );
  }

  if (goals.length > 0) {
    return (
      <div>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          Here's what you should focus on
        </Typography>
        <Typography variant="body2" gutterBottom>
          These are the five goals to focus on. Ignore the rest!
        </Typography>

        <List>
        {goals.slice(0, 5).map((goal) => (
          <ListItem key={goal}>
          <ListItemAvatar>
            <Avatar>
              <FormatListNumberedIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={goal}/>
        </ListItem>
        ))}
        </List>
      </div>
    );
  }

  return null;
};

export default Instructions;
