import { TwentyFive } from "./gen/twentyfive/twentyfive_rsm_react";

import { STATE_MACHINE_ID } from "./const";

import DraggableList from './DraggableList';
import { DropResult } from 'react-beautiful-dnd';

const GoalList = () => {
  const { useListGoals } = TwentyFive({ id: STATE_MACHINE_ID });
  const {
    response,
    mutations: { MoveGoal },
  } = useListGoals();
  
  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;

    if (response === undefined) {
      return null;
    }

    MoveGoal({ goal: response.goals[source.index], targetIndex: destination.index})
  };

  if (response === undefined) {
    return null;
  }

  return (
    <DraggableList items={response.goals} onDragEnd={onDragEnd}/>
  );
}

export default GoalList;