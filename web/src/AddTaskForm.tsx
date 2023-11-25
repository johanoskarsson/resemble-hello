import { useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { TwentyFive } from "./gen/twentyfive/twentyfive_rsm_react";

import { STATE_MACHINE_ID } from "./const";


const AddTaskForm = () => {
  // State of the input component.
  const [task, setTask] = useState("");

  const { useListTasks } = TwentyFive({ id: STATE_MACHINE_ID });
  const {
    response,
    mutations: { AddTask },
  } = useListTasks();

  const handleClick = () => {
    AddTask({ task: task }).then(() => setTask(""));
  };

  return (
    <form>
      <Stack spacing={2}>
          <TextField
              required
              id="outlined-required"
              label="Add task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              autoFocus
            />

          <Button type="submit" variant="outlined" onClick={handleClick}>Add</Button>
      </Stack>
    </form>
  );
};

export default AddTaskForm;
