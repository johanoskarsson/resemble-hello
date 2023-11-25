import asyncio
from twentyfive.twentyfive_rsm import (
    TwentyFive,
    TwentyFiveState,
    CreateTaskListRequest,
    CreateTaskListResponse,
    ListTasksRequest,
    ListTasksResponse,
    AddTaskRequest,
    AddTaskResponse,
    MoveTaskRequest,
    MoveTaskResponse,
    DeleteTaskRequest,
    DeleteTaskResponse,
)
from resemble.aio.contexts import ReaderContext, WriterContext


class TwentyFiveServicer(TwentyFive.Interface):

    async def CreateTaskList(
        self,
        context: WriterContext,
        state: TwentyFiveState,
        request: CreateTaskListRequest,
    ) -> TwentyFive.CreateTaskListEffects:
        state = TwentyFiveState()
        return TwentyFive.CreateTaskListEffects(state=state, response=CreateTaskListResponse())
    
    async def ListTasks(
        self,
        context: ReaderContext,
        state: TwentyFiveState,
        request: ListTasksRequest,
    ) -> ListTasksResponse:
        return ListTasksResponse(tasks=state.tasks)

    async def AddTask(
        self,
        context: WriterContext,
        state: TwentyFiveState,
        request: AddTaskRequest,
    ) -> TwentyFive.AddTaskEffects:
        task = request.task
        
        if task not in state.tasks:
            state.tasks.extend([task])

        return TwentyFive.AddTaskEffects(state=state, response=AddTaskResponse())

    async def MoveTask(
        self,
        context: WriterContext,
        state: TwentyFiveState,
        request: MoveTaskRequest,
    ) -> TwentyFive.MoveTaskEffects:
        task = request.task
        # TODO 
        # TODO how to read the state to verify that this does not already exist?
        state.tasks.extend([task])
        return TwentyFive.AddTaskEffects(state=state, response=MoveTaskResponse())

    async def DeleteTask(
        self,
        context: WriterContext,
        state: TwentyFiveState,
        request: DeleteTaskRequest,
    ) -> TwentyFive.DeleteTaskEffects:
        task = request.task
        state.tasks.remove(task)
        return TwentyFive.DeleteTaskEffects(state=state, response=DeleteTaskResponse())
