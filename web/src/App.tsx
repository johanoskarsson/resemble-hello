import { TwentyFive } from "./gen/twentyfive/twentyfive_rsm_react";
import { STATE_MACHINE_ID } from "./const";

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";

import Instructions from "./Instructions";

const App = () => {
  return null;
  // const { useListTasks } = TwentyFive({ id: STATE_MACHINE_ID });
  // const { response } = useListTasks();

  // let tasksCount = response === undefined ? 0 : response.tasks.length;

  // return (
  //   <Container>
  //     <Grid container justifyContent="center" rowSpacing={1} columnSpacing={24}>
  //       <Grid item xs={8}>
  //         <Typography variant="h1" gutterBottom align="center">TwentyFive</Typography>
  //       </Grid>
  //       <Grid item xs={6}>
  //         <Instructions tasksCount={tasksCount}/>
  //       </Grid>
  //       <Grid item xs={6}>
  //       {(tasksCount < 25) ? <AddTaskForm/> : null}
  //         <TaskList/>
  //       </Grid>
  //     </Grid>
  //   </Container>
  // );
};

export default App;
