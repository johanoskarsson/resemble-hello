import { TwentyFive } from "./gen/twentyfive/twentyfive_rsm_react";
import { STATE_MACHINE_ID } from "./const";

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import GoalList from "./GoalList";
import AddGoalForm from "./AddGoalForm";

import Instructions from "./Instructions";

const App = () => {
  return null;
  // const { useListGoals } = TwentyFive({ id: STATE_MACHINE_ID });
  // const { response } = useListGoals();

  // let goalsCount = response === undefined ? 0 : response.goals.length;

  // return (
  //   <Container>
  //     <Grid container justifyContent="center" rowSpacing={1} columnSpacing={24}>
  //       <Grid item xs={8}>
  //         <Typography variant="h1" gutterBottom align="center">TwentyFive</Typography>
  //       </Grid>
  //       <Grid item xs={6}>
  //         <Instructions goalsCount={goalsCount}/>
  //       </Grid>
  //       <Grid item xs={6}>
  //       {(goalsCount < 25) ? <AddGoalForm/> : null}
  //         <goalList/>
  //       </Grid>
  //     </Grid>
  //   </Container>
  // );
};

export default App;
