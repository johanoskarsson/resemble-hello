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

const TaskList = () => {
  const { useListTasks } = TwentyFive({ id: STATE_MACHINE_ID });
  const {
    response,
    mutations: { DeleteTask, MoveTask },
  } = useListTasks();
  
  const handleClick = (task: string) => {
    DeleteTask({ task: task });
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
    <DraggableList items={response.tasks} onDragEnd={onDragEnd}></DraggableList>
    // <List>
    //   {response !== undefined &&
    //     response.tasks.length > 0 &&
    //     response.tasks.map((task: string) => (
    //       <div>
    //       <Divider />
    //       <ListItem key={task} dense secondaryAction={
    //         <IconButton edge="end" aria-label="delete" onClick={(e) => handleClick(task)}>
    //           <DeleteIcon />
    //         </IconButton>
    //       }
    //     >
    //       <ListItemAvatar>
    //         <Avatar>
    //           <FormatListNumberedIcon />
    //         </Avatar>
    //       </ListItemAvatar>
    //       <ListItemText primary={task}/>
    //     </ListItem>
    //     </div>
    //     ))}
    // </List>
  );
}

export default TaskList;