import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TwentyFive } from "./gen/twentyfive/twentyfive_rsm_react";
import { STATE_MACHINE_ID } from "./const";

import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import ReorderIcon from "@mui/icons-material/Reorder";

import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';

// stolen from https://codesandbox.io/p/sandbox/draggable-material-ui-oj3wz?file=%2Fsrc%2Fcomponents%2FDraggableListItem.tsx%3A1%2C1-48%2C1

export type DraggableListItemProps = {
  item: string;
  index: number;
};

const DraggableListItem = ({ item, index }: DraggableListItemProps) => {
  const { useListGoals } = TwentyFive({ id: STATE_MACHINE_ID });
  const {
    response,
    mutations: { DeleteGoal, MoveGoal },
  } = useListGoals();
  
  const handleClick = (goal: string) => {
    DeleteGoal({ goal: goal });
  };

  return (
    <Draggable draggableId={item} index={index}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          dense secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={(e) => handleClick(item)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <ReorderIcon/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item} />
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
