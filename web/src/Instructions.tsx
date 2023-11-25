import Typography from '@mui/material/Typography';

const Instructions = ({ goalsCount: goalsCount }: { goalsCount: number }) => {
  const totalGoals = 25;

  if (goalsCount === 0) {
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

  if (goalsCount < totalGoals) {
    return (
      <div>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          We're getting there!
        </Typography>
        <Typography variant="body2">
          We've got {goalsCount} goals, we need {totalGoals-goalsCount} more! Keep adding!
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
        Let's prioritize
      </Typography>
      <Typography variant="body2">
        You've got {totalGoals}, well done! Now order them by placing the goals you want to focus on first.
      </Typography>
    </div>
  );
};

export default Instructions;
