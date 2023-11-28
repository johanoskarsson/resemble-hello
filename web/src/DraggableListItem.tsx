import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

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
  DeleteItem: any;
}

const DraggableListItem = ({ item, index, DeleteItem }: DraggableListItemProps) => {
  const handleClick = (goal: string) => {
    DeleteItem({ goal: goal });
  };

  return (
    <Draggable draggableId={item} index={index}>
      {(provided, snapshot) => (
        <div>
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
          <Divider/>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
