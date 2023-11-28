import DraggableList from './DraggableList';
import DraggableListItem from './DraggableListItem';
import { DropResult } from 'react-beautiful-dnd';
import type { PartialMessage } from "@bufbuild/protobuf";
import { ResponseOrError } from "@reboot-dev/resemble-react";
import {
  DeleteGoalResponse,
  DeleteGoalRequest,
  MoveGoalResponse,
  MoveGoalRequest,
} from "./gen/twentyfive/twentyfive_rsm_react";


const GoalList = (
  { goals, DeleteGoal, MoveGoal }: {
    goals: string[],
    DeleteGoal: (request: PartialMessage<DeleteGoalRequest>) => Promise<ResponseOrError<DeleteGoalResponse>>,
    MoveGoal: (request: PartialMessage<MoveGoalRequest>) => Promise<ResponseOrError<MoveGoalResponse>>,
  }
) => {
  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;

    MoveGoal({ goal: goals[source.index], targetIndex: destination.index})
  };

  return (
    <DraggableList onDragEnd={onDragEnd}>
      {goals.map((goal, index) => (
        <DraggableListItem item={goal} index={index} key={`${goal}-${index}`} DeleteItem={DeleteGoal} />
      ))}
    </DraggableList>
  );
}

export default GoalList;
