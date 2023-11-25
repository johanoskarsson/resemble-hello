import Typography from '@mui/material/Typography';

const Instructions = ({ tasksCount }: { tasksCount: number }) => {
  const totalTasks = 25;

  if (tasksCount === 0) {
    return (
      <div>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          Let's come up with {totalTasks} things you want to do or accomplish.
        </Typography>
        <Typography variant="body2">
          For example: visit Japan, learn Spanish or get promoted to village chief.
          <br/>
          Let your imagination run wild.
        </Typography>
      </div>
    );
  }

  if (tasksCount < totalTasks) {
    return (
      <div>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
          We're getting there!
        </Typography>
        <Typography variant="body2">
          We've got {tasksCount} tasks, we need {totalTasks-tasksCount} more! Keep adding!
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
        You've got {totalTasks}, well done! Now order them by placing the tasks you want to focus on first.
      </Typography>
    </div>
  );
};

export default Instructions;
