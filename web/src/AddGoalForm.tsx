import { MouseEvent, useState } from "react";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import type { PartialMessage } from "@bufbuild/protobuf";
import { ResponseOrError } from "@reboot-dev/resemble-react";
import {
  AddGoalResponse,
  AddGoalRequest,
} from "./gen/twentyfive/twentyfive_rsm_react";


const AddGoalForm = (
  { AddGoal }: {
    AddGoal: (request: PartialMessage<AddGoalRequest>) => Promise<ResponseOrError<AddGoalResponse>>
  }
) => {
  // State of the input component.
  const [goal, setGoal] = useState("");

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    // Don't refresh/re-render the entire page on form submission so
    // our app doesn't look glitchy.
    event.preventDefault();

    AddGoal({ goal: goal }).then(() => setGoal(""));
  };

  return (
    <form>
      <Stack spacing={2}>
          <TextField
              required
              id="outlined-required"
              label="Add goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              autoFocus
            />

          <Button type="submit" variant="outlined" onClick={handleClick}>Add</Button>
      </Stack>
    </form>
  );
};

export default AddGoalForm;
