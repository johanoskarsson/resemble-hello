import { TwentyFive } from "./gen/twentyfive/twentyfive_rsm_react";

import { STATE_MACHINE_ID } from "./const";

import DraggableList from './DraggableList';
import { DropResult } from 'react-beautiful-dnd';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import DeleteIcon from '@mui/icons-material/Delete';

const GoalList = () => {
  const { useListGoals } = TwentyFive({ id: STATE_MACHINE_ID });
  const {
    response,
    mutations: { DeleteGoal, MoveGoal },
  } = useListGoals();
  
  const handleClick = (goal: string) => {
    DeleteGoal({ goal: goal });
  };
 
  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;

    // const newItems = reorder(items, source.index, destination.index);

    // setItems(newItems);
  };

  if (response === undefined) {
    return null;
  }

  return (
    <DraggableList items={response.goals} onDragEnd={onDragEnd}></DraggableList>
    // <List>
    //   {response !== undefined &&
    //     response.goals.length > 0 &&
    //     response.goals.map((goal: string) => (
    //       <div>
    //       <Divider />
    //       <ListItem key={goal} dense secondaryAction={
    //         <IconButton edge="end" aria-label="delete" onClick={(e) => handleClick(goal)}>
    //           <DeleteIcon />
    //         </IconButton>
    //       }
    //     >
    //       <ListItemAvatar>
    //         <Avatar>
    //           <FormatListNumberedIcon />
    //         </Avatar>
    //       </ListItemAvatar>
    //       <ListItemText primary={goal}/>
    //     </ListItem>
    //     </div>
    //     ))}
    // </List>
  );
}

export default GoalList;