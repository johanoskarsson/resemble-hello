import asyncio
from twentyfive.twentyfive_rsm import (
    TwentyFive,
    TwentyFiveState,
    CreateGoalListRequest,
    CreateGoalListResponse,
    ListGoalsRequest,
    ListGoalsResponse,
    AddGoalRequest,
    AddGoalResponse,
    MoveGoalRequest,
    MoveGoalResponse,
    DeleteGoalRequest,
    DeleteGoalResponse,
)
from resemble.aio.contexts import ReaderContext, WriterContext


class TwentyFiveServicer(TwentyFive.Interface):

    async def CreateGoalList(
        self,
        context: WriterContext,
        request: CreateGoalListRequest,
    ) -> TwentyFive.CreateGoalListEffects:
        state = TwentyFiveState(goals=[])
        return TwentyFive.CreateGoalListEffects(state=state, response=CreateGoalListResponse())
    
    async def ListGoals(
        self,
        context: ReaderContext,
        state: TwentyFiveState,
        request: ListGoalsRequest,
    ) -> ListGoalsResponse:
        return ListGoalsResponse(goals=state.goals)

    async def AddGoal(
        self,
        context: WriterContext,
        state: TwentyFiveState,
        request: AddGoalRequest,
    ) -> TwentyFive.AddGoalEffects:
        goal = request.goal
        
        if goal not in state.goals:
            state.goals.extend([goal])

        return TwentyFive.AddGoalEffects(state=state, response=AddGoalResponse())

    async def MoveGoal(
        self,
        context: WriterContext,
        state: TwentyFiveState,
        request: MoveGoalRequest,
    ) -> TwentyFive.MoveGoalEffects:
        goal = request.goal
        state.goals.remove(goal)
        state.goals.insert(request.targetIndex, goal)
        return TwentyFive.MoveGoalEffects(state=state, response=MoveGoalResponse())

    async def DeleteGoal(
        self,
        context: WriterContext,
        state: TwentyFiveState,
        request: DeleteGoalRequest,
    ) -> TwentyFive.DeleteGoalEffects:
        goal = request.goal
        state.goals.remove(goal)
        return TwentyFive.DeleteGoalEffects(state=state, response=DeleteGoalResponse())
