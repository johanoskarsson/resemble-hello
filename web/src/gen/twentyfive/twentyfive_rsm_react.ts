import type {
  PartialMessage as __bufbuildProtobufPartialMessage,
} from "@bufbuild/protobuf";
import {
  Deferred as __resembleReactDeferred,
  Event as __resembleReactEvent,
  IQueryRequest as __resembleIQueryRequest,
  IQueryResponse as __resembleIQueryResponse,
  Mutation as __resembleMutation,
  QueryRequest as __resembleQueryRequest,
  QueryResponse  as __resembleQueryResponse,
  ResponseOrError as __resembleResponseOrError,
  filterSet as __resembleFilterSet,
  popMutationMaybeFromLocalStorage as __resemblePopMutationMaybeFromLocalStorage,
  pushMutationMaybeToLocalStorage as __resemblePushMutationMaybeToLocalStorage,
  retryForever as __resembleRetryForever,
  useResembleContext as __resembleUseResembleContext
} from "@reboot-dev/resemble-react";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
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
} from "./twentyfive_pb";

// Additionally re-export all messages from the pb module.
export {
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
};

// Check if safari. Print warning, if yes.
// TODO(riley): fix chaos streaming for Safari.
//
// TODO(riley): move this all into helpers.ts.

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let warnings: { [key: string]: string } = {};

function renderWarnings() {
  const html = document.documentElement;

  // Remove previously rendered warnings so that we compute the proper
  // offsets for layout.
  //
  // TODO(benh): put all of these in a containing `div` so we can just
  // remove it instead?
  for (const warning in warnings) {
    const warningElement = document.getElementById(warning);
    if (warningElement !== null) {
      html.removeChild(warningElement);
    }
  }

  let warningsShown = 0;

  for (const warning in warnings) {
    const warningElement = document.createElement("div");
    warningElement.setAttribute("id", warning);

    // Positioning: left-top corner but place each warning to the right of the previous.
    const messageWidth = 300;
    const leftOffset = warningsShown * messageWidth;
    // More positioning: add a little margin, hover above ~everything (z-index).
    // Looks: red border, white background.
    // Content: text, slightly padded.
    warningElement.style.cssText =
    `position:absolute;top:0px;left:${leftOffset}px;margin:4px;width:300px;z-index:100000;
    border:3px solid red;border-radius:4px;background-color:white;
    padding:4px;font-family:sans-serif`;

    warningElement.innerHTML = "⚠ " + warnings[warning];
    html.appendChild(warningElement);
    warningsShown++;
  }
}

function addWarning({ messageHtml, id }: { messageHtml: string, id: string }) {
  console.warn(messageHtml);
  warnings[id] = messageHtml;
  renderWarnings();
}

function removeWarning({ id }: { id: string }) {
  if (id in warnings) {
    delete warnings[id];

    const warningElement = document.getElementById(id);

    if (warningElement !== null) {
      const html = document.documentElement;
      html.removeChild(warningElement);
    }

    renderWarnings();
  }
}

if (isSafari) {
  const warningText = `Some features of this application may not work as
  intended on Safari. A fix is coming soon! Consider using Firefox or Chrome in
  the meantime.`;
  addWarning({ messageHtml: warningText, id: "isSafari" });
}

async function guardedFetch(request: Request, options: any = {}) {
  try {
    const response = await fetch(request, options);

    // If no exception was thrown while doing a fetch for
    // `localhost.direct` then we must be able to reach it,
    // so if we previously had displayed a warning stop
    // displaying it now.
    //
    // Likely what has happened is the server we are trying
    // to fetch from restarted.
    if (request.url.startsWith("https://localhost.direct") && "guardedFetch" in warnings) {
      removeWarning({ id: "guardedFetch"});
    }

    return response;
  } catch (error) {
    // The fetch failed due to some network error.
    if (request.url.startsWith("https://localhost.direct") && !("guardedFetch" in warnings)) {
      // One possible reason for the error is that the user's ISP doesn't let
      // the user resolve `localhost.direct`. We'd like to warn the user that
      // this is a possibility.
      //
      // We unfortunately can't distinguish between a DNS resolution error and any
      // other kind of network error, even though the user's console shows that
      // information; see:
      //   https://bugs.chromium.org/p/chromium/issues/detail?id=718447
      // Therefore our error message has to be somewhat generic.
      const endpoint = request.url.split("/")[2];  // e.g. "localhost.direct:9991"
      const warningText = `Hi! We hope you're enjoying the Resemble dev experience.
      Looks like we couldn't connect to '${endpoint}', which should resolve to
      '${endpoint.replace("localhost.direct", "127.0.0.1")}'. This may be due
      to one of the following reasons:<br>
      <li>Your backend application is not running.</li>
      <li>Your backend application is running, but not on 127.0.0.1 (e.g.,
          you're using a Codespace in the cloud), and you no longer have connectivity
          (bad Wi-Fi? flaky network? or problems with your port forwarder?)</li>
      <li>Your backend appllication is running, but on a different port.</li>
      <li>Your ISP's DNS server does not allow you to resolve the domain
          'localhost.direct'; see
          <a href="https://reboot-dev.github.io/respect/docs/known_issues">
          "Known Issues"</a> for more information.</li>
      `
      addWarning({ messageHtml: warningText, id: "guardedFetch" });
    }
    throw error;
  }
}

// Start of service specific code.
///////////////////////////////////////////////////////////////////////////

export interface TwentyFiveApi {
  CreateTaskList: (partialRequest?: __bufbuildProtobufPartialMessage<CreateTaskListRequest>) =>
  Promise<CreateTaskListResponse>;
  ListTasks: (partialRequest?: __bufbuildProtobufPartialMessage<ListTasksRequest>) =>
  Promise<ListTasksResponse>;
  AddTask: (partialRequest?: __bufbuildProtobufPartialMessage<AddTaskRequest>) =>
  Promise<AddTaskResponse>;
  MoveTask: (partialRequest?: __bufbuildProtobufPartialMessage<MoveTaskRequest>) =>
  Promise<MoveTaskResponse>;
  DeleteTask: (partialRequest?: __bufbuildProtobufPartialMessage<DeleteTaskRequest>) =>
  Promise<DeleteTaskResponse>;
  useListTasks: (partialRequest?: __bufbuildProtobufPartialMessage<ListTasksRequest>) => {
   response: ListTasksResponse | undefined;
    isLoading: boolean;
    error: unknown;
    mutations: {
       CreateTaskList: (request: __bufbuildProtobufPartialMessage<CreateTaskListRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<CreateTaskListResponse>>;
       AddTask: (request: __bufbuildProtobufPartialMessage<AddTaskRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<AddTaskResponse>>;
       MoveTask: (request: __bufbuildProtobufPartialMessage<MoveTaskRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<MoveTaskResponse>>;
       DeleteTask: (request: __bufbuildProtobufPartialMessage<DeleteTaskRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<DeleteTaskResponse>>;
    };
      pendingCreateTaskListMutations: {
        request: CreateTaskListRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedCreateTaskListMutations: {
        request: CreateTaskListRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredCreateTaskListMutations: {
        request: CreateTaskListRequest;
        idempotencyKey: string;
        run: () => void;
      }[];
      pendingAddTaskMutations: {
        request: AddTaskRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedAddTaskMutations: {
        request: AddTaskRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredAddTaskMutations: {
        request: AddTaskRequest;
        idempotencyKey: string;
        run: () => void;
      }[];
      pendingMoveTaskMutations: {
        request: MoveTaskRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedMoveTaskMutations: {
        request: MoveTaskRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredMoveTaskMutations: {
        request: MoveTaskRequest;
        idempotencyKey: string;
        run: () => void;
      }[];
      pendingDeleteTaskMutations: {
        request: DeleteTaskRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedDeleteTaskMutations: {
        request: DeleteTaskRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredDeleteTaskMutations: {
        request: DeleteTaskRequest;
        idempotencyKey: string;
        run: () => void;
      }[];
  };
}


export interface SettingsParams {
  id: string;
  storeMutationsLocallyInNamespace?: string;
}
export const TwentyFive = ({ id, storeMutationsLocallyInNamespace}: SettingsParams): TwentyFiveApi => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.append("x-resemble-service-name", "twentyfive.TwentyFive");
  headers.append("x-resemble-actor-id", id);
  headers.append("Connection", "keep-alive");

  const resembleContext = __resembleUseResembleContext();

  const newRequest = (
    requestBody: any,
    path: string,
    method: "GET" | "POST",
    idempotencyKey?: string,
  ) => {
    if (idempotencyKey !== undefined) {
      headers.set("x-resemble-idempotency-key", idempotencyKey);
    }
    return new Request(`${resembleContext.client?.endpoint}${path}`, {
      method: method,
      headers: headers,
      body:
        Object.keys(requestBody).length !== 0
          ? JSON.stringify(requestBody)
          : null,
    });
  };

  const CreateTaskList = async (partialRequest: __bufbuildProtobufPartialMessage<CreateTaskListRequest> = {}) => {
    const request = partialRequest instanceof CreateTaskListRequest ? partialRequest : new CreateTaskListRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.CreateTaskList", "POST"));

    return await response.json();
  };

  const ListTasks = async (partialRequest: __bufbuildProtobufPartialMessage<ListTasksRequest> = {}) => {
    const request = partialRequest instanceof ListTasksRequest ? partialRequest : new ListTasksRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.ListTasks", "POST"));

    if (!response.ok && response.headers.has("grpc-status")) {
      const grpcStatus = response.headers.get("grpc-status");
      let grpcMessage = response.headers.get("grpc-message");
      throw new Error(
        `'twentyfive.TwentyFive.ListTasks' for '${id}' responded ` +
          `with status ${grpcStatus}` +
          `${grpcMessage !== null ? ": " + grpcMessage : ""}`
      );
    } else if (!response.ok) {
      throw new Error(
        `'twentyfive.TwentyFive.ListTasks' failed: ${response.body}`
      );
    }

    return await response.json();
  };

  const useListTasks = (partialRequest: __bufbuildProtobufPartialMessage<ListTasksRequest> = {}) => {
    const [response, setResponse] = useState<ListTasksResponse>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>();

    // NOTE: using "refs" here because we want to "remember" some
    // state, but don't want setting that state to trigger new renders (see
    // https://react.dev/learn/referencing-values-with-refs).
    // Using a ref here so that we don't render every time we set it.

    const observedIdempotencyKeys = useRef(new Set<string>());
    // NOTE: rather than starting with undefined for 'flushMutations'
    // we start with an event so any mutations that may get created
    // before we've started reading will get queued.
    const flushMutations = useRef<__resembleReactEvent | undefined>(new __resembleReactEvent());

    const [abortController, setAbortController] = useState<AbortController | undefined>();

    useEffect(() => {
      if (abortController === undefined) {
        setAbortController(new AbortController());
      }
      return () => {
        abortController?.abort();
      };
    }, [abortController]);

    const request = partialRequest instanceof ListTasksRequest
        ? partialRequest
        : new ListTasksRequest(partialRequest);

    // NOTE: using a ref for the 'request' and 'settings' (below) so
    // that it doesn't get changed after the first time calling 'usePing'.
    const requestRef = useRef(request);

    // We are using serialized string comparison here since we can't do value
    // equality of anonymous objects. We must use the proto library's toBinary()
    // since JavaScript's standard JSON library can't serialize every possible
    // field type (notably BigInt).
    const first_request_serialized = requestRef.current.toBinary().toString();
    const current_request_serialized = request.toBinary().toString();
    if (current_request_serialized !== first_request_serialized) {
      throw new Error("Changing the request is not supported!");
    }

    const settingsRef = useRef({id, storeMutationsLocallyInNamespace});
    // We are using string comparison here since we can't do value
    // equality of anonymous objects.
    if (JSON.stringify(settingsRef.current) !== JSON.stringify({id, storeMutationsLocallyInNamespace})) {
      throw new Error("Changing settings is not supported!");
    }

    const localStorageKeyRef = useRef(storeMutationsLocallyInNamespace);

    const queuedMutations = useRef<Array<() => void>>([]);

function hasRunningMutations(): boolean {
      if (
      runningCreateTaskListMutations.current.length > 0||
      runningAddTaskMutations.current.length > 0||
      runningMoveTaskMutations.current.length > 0||
      runningDeleteTaskMutations.current.length > 0) {
        return true;
      }
      return false;
    }


    const runningCreateTaskListMutations = useRef<__resembleMutation<CreateTaskListRequest>[]>([]);
    const recoveredCreateTaskListMutations = useRef<
      [__resembleMutation<CreateTaskListRequest>, () => void][]
    >([]);
    const shouldClearFailedCreateTaskListMutations = useRef(false);
    const [failedCreateTaskListMutations, setFailedCreateTaskListMutations] = useState<
      __resembleMutation<CreateTaskListRequest>[]
    >([]);
    const queuedCreateTaskListMutations = useRef<[__resembleMutation<CreateTaskListRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeCreateTaskListMutations = (): [
      __resembleMutation<CreateTaskListRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = CreateTaskList
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<CreateTaskListRequest>[] = JSON.parse(value);
      const recoveredCreateTaskListMutations: [
        __resembleMutation<CreateTaskListRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredCreateTaskListMutations.push([mutation, () => __CreateTaskList(mutation)]);
      }
      return recoveredCreateTaskListMutations;
    }
    const doOnceCreateTaskList = useRef(true)
    if (doOnceCreateTaskList.current) {
      doOnceCreateTaskList.current = false
      recoveredCreateTaskListMutations.current = recoverAndPurgeCreateTaskListMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingCreateTaskListMutations, setUnobservedPendingCreateTaskListMutations] =
      useState<__resembleMutation<CreateTaskListRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedCreateTaskListMutations.current = true;
    }, [failedCreateTaskListMutations]);

    async function __CreateTaskList(
      mutation: __resembleMutation<CreateTaskListRequest>
    ): Promise<__resembleResponseOrError<CreateTaskListResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningCreateTaskListMutations
        runningCreateTaskListMutations.current.push(mutation)
        return _Mutation<CreateTaskListRequest, CreateTaskListResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.CreateTaskList",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingCreateTaskListMutations,
          abortController,
          shouldClearFailedCreateTaskListMutations,
          setFailedCreateTaskListMutations,
          runningCreateTaskListMutations,
          flushMutations,
          queuedMutations,
          CreateTaskListRequest,
          CreateTaskListResponse.fromJson
        );
      } finally {
        runningCreateTaskListMutations.current = runningCreateTaskListMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "CreateTaskList",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _CreateTaskList(mutation: __resembleMutation<CreateTaskListRequest>) {
      setUnobservedPendingCreateTaskListMutations(
        (mutations) => [...mutations, mutation]
      )

      // NOTE: we only run one mutation at a time so that we provide a
      // serializable experience for the end user but we will
      // eventually support mutations in parallel when we have strong
      // eventually consistent writers.
      if (
        hasRunningMutations() ||
        queuedMutations.current.length > 0 ||
        flushMutations.current !== undefined
      ) {
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<CreateTaskListResponse>>(() =>
          __CreateTaskList(mutation)
        );

        // Add to localStorage here.
        queuedCreateTaskListMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedCreateTaskListMutations.current) {
            queuedCreateTaskListMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "CreateTaskList", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningCreateTaskListMutations` in `__CreateTaskList`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __CreateTaskList(mutation);
      }
    }

    async function CreateTaskList(
      partialRequest: __bufbuildProtobufPartialMessage<CreateTaskListRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<CreateTaskListResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof CreateTaskListRequest ? partialRequest : new CreateTaskListRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _CreateTaskList(mutation);
    }

    const runningAddTaskMutations = useRef<__resembleMutation<AddTaskRequest>[]>([]);
    const recoveredAddTaskMutations = useRef<
      [__resembleMutation<AddTaskRequest>, () => void][]
    >([]);
    const shouldClearFailedAddTaskMutations = useRef(false);
    const [failedAddTaskMutations, setFailedAddTaskMutations] = useState<
      __resembleMutation<AddTaskRequest>[]
    >([]);
    const queuedAddTaskMutations = useRef<[__resembleMutation<AddTaskRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeAddTaskMutations = (): [
      __resembleMutation<AddTaskRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = AddTask
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<AddTaskRequest>[] = JSON.parse(value);
      const recoveredAddTaskMutations: [
        __resembleMutation<AddTaskRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredAddTaskMutations.push([mutation, () => __AddTask(mutation)]);
      }
      return recoveredAddTaskMutations;
    }
    const doOnceAddTask = useRef(true)
    if (doOnceAddTask.current) {
      doOnceAddTask.current = false
      recoveredAddTaskMutations.current = recoverAndPurgeAddTaskMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingAddTaskMutations, setUnobservedPendingAddTaskMutations] =
      useState<__resembleMutation<AddTaskRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedAddTaskMutations.current = true;
    }, [failedAddTaskMutations]);

    async function __AddTask(
      mutation: __resembleMutation<AddTaskRequest>
    ): Promise<__resembleResponseOrError<AddTaskResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningAddTaskMutations
        runningAddTaskMutations.current.push(mutation)
        return _Mutation<AddTaskRequest, AddTaskResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.AddTask",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingAddTaskMutations,
          abortController,
          shouldClearFailedAddTaskMutations,
          setFailedAddTaskMutations,
          runningAddTaskMutations,
          flushMutations,
          queuedMutations,
          AddTaskRequest,
          AddTaskResponse.fromJson
        );
      } finally {
        runningAddTaskMutations.current = runningAddTaskMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "AddTask",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _AddTask(mutation: __resembleMutation<AddTaskRequest>) {
      setUnobservedPendingAddTaskMutations(
        (mutations) => [...mutations, mutation]
      )

      // NOTE: we only run one mutation at a time so that we provide a
      // serializable experience for the end user but we will
      // eventually support mutations in parallel when we have strong
      // eventually consistent writers.
      if (
        hasRunningMutations() ||
        queuedMutations.current.length > 0 ||
        flushMutations.current !== undefined
      ) {
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<AddTaskResponse>>(() =>
          __AddTask(mutation)
        );

        // Add to localStorage here.
        queuedAddTaskMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedAddTaskMutations.current) {
            queuedAddTaskMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "AddTask", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningAddTaskMutations` in `__AddTask`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __AddTask(mutation);
      }
    }

    async function AddTask(
      partialRequest: __bufbuildProtobufPartialMessage<AddTaskRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<AddTaskResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof AddTaskRequest ? partialRequest : new AddTaskRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _AddTask(mutation);
    }

    const runningMoveTaskMutations = useRef<__resembleMutation<MoveTaskRequest>[]>([]);
    const recoveredMoveTaskMutations = useRef<
      [__resembleMutation<MoveTaskRequest>, () => void][]
    >([]);
    const shouldClearFailedMoveTaskMutations = useRef(false);
    const [failedMoveTaskMutations, setFailedMoveTaskMutations] = useState<
      __resembleMutation<MoveTaskRequest>[]
    >([]);
    const queuedMoveTaskMutations = useRef<[__resembleMutation<MoveTaskRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeMoveTaskMutations = (): [
      __resembleMutation<MoveTaskRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = MoveTask
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<MoveTaskRequest>[] = JSON.parse(value);
      const recoveredMoveTaskMutations: [
        __resembleMutation<MoveTaskRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredMoveTaskMutations.push([mutation, () => __MoveTask(mutation)]);
      }
      return recoveredMoveTaskMutations;
    }
    const doOnceMoveTask = useRef(true)
    if (doOnceMoveTask.current) {
      doOnceMoveTask.current = false
      recoveredMoveTaskMutations.current = recoverAndPurgeMoveTaskMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingMoveTaskMutations, setUnobservedPendingMoveTaskMutations] =
      useState<__resembleMutation<MoveTaskRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedMoveTaskMutations.current = true;
    }, [failedMoveTaskMutations]);

    async function __MoveTask(
      mutation: __resembleMutation<MoveTaskRequest>
    ): Promise<__resembleResponseOrError<MoveTaskResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningMoveTaskMutations
        runningMoveTaskMutations.current.push(mutation)
        return _Mutation<MoveTaskRequest, MoveTaskResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.MoveTask",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingMoveTaskMutations,
          abortController,
          shouldClearFailedMoveTaskMutations,
          setFailedMoveTaskMutations,
          runningMoveTaskMutations,
          flushMutations,
          queuedMutations,
          MoveTaskRequest,
          MoveTaskResponse.fromJson
        );
      } finally {
        runningMoveTaskMutations.current = runningMoveTaskMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "MoveTask",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _MoveTask(mutation: __resembleMutation<MoveTaskRequest>) {
      setUnobservedPendingMoveTaskMutations(
        (mutations) => [...mutations, mutation]
      )

      // NOTE: we only run one mutation at a time so that we provide a
      // serializable experience for the end user but we will
      // eventually support mutations in parallel when we have strong
      // eventually consistent writers.
      if (
        hasRunningMutations() ||
        queuedMutations.current.length > 0 ||
        flushMutations.current !== undefined
      ) {
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<MoveTaskResponse>>(() =>
          __MoveTask(mutation)
        );

        // Add to localStorage here.
        queuedMoveTaskMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedMoveTaskMutations.current) {
            queuedMoveTaskMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "MoveTask", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningMoveTaskMutations` in `__MoveTask`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __MoveTask(mutation);
      }
    }

    async function MoveTask(
      partialRequest: __bufbuildProtobufPartialMessage<MoveTaskRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<MoveTaskResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof MoveTaskRequest ? partialRequest : new MoveTaskRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _MoveTask(mutation);
    }

    const runningDeleteTaskMutations = useRef<__resembleMutation<DeleteTaskRequest>[]>([]);
    const recoveredDeleteTaskMutations = useRef<
      [__resembleMutation<DeleteTaskRequest>, () => void][]
    >([]);
    const shouldClearFailedDeleteTaskMutations = useRef(false);
    const [failedDeleteTaskMutations, setFailedDeleteTaskMutations] = useState<
      __resembleMutation<DeleteTaskRequest>[]
    >([]);
    const queuedDeleteTaskMutations = useRef<[__resembleMutation<DeleteTaskRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeDeleteTaskMutations = (): [
      __resembleMutation<DeleteTaskRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = DeleteTask
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<DeleteTaskRequest>[] = JSON.parse(value);
      const recoveredDeleteTaskMutations: [
        __resembleMutation<DeleteTaskRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredDeleteTaskMutations.push([mutation, () => __DeleteTask(mutation)]);
      }
      return recoveredDeleteTaskMutations;
    }
    const doOnceDeleteTask = useRef(true)
    if (doOnceDeleteTask.current) {
      doOnceDeleteTask.current = false
      recoveredDeleteTaskMutations.current = recoverAndPurgeDeleteTaskMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingDeleteTaskMutations, setUnobservedPendingDeleteTaskMutations] =
      useState<__resembleMutation<DeleteTaskRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedDeleteTaskMutations.current = true;
    }, [failedDeleteTaskMutations]);

    async function __DeleteTask(
      mutation: __resembleMutation<DeleteTaskRequest>
    ): Promise<__resembleResponseOrError<DeleteTaskResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningDeleteTaskMutations
        runningDeleteTaskMutations.current.push(mutation)
        return _Mutation<DeleteTaskRequest, DeleteTaskResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.DeleteTask",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingDeleteTaskMutations,
          abortController,
          shouldClearFailedDeleteTaskMutations,
          setFailedDeleteTaskMutations,
          runningDeleteTaskMutations,
          flushMutations,
          queuedMutations,
          DeleteTaskRequest,
          DeleteTaskResponse.fromJson
        );
      } finally {
        runningDeleteTaskMutations.current = runningDeleteTaskMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "DeleteTask",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _DeleteTask(mutation: __resembleMutation<DeleteTaskRequest>) {
      setUnobservedPendingDeleteTaskMutations(
        (mutations) => [...mutations, mutation]
      )

      // NOTE: we only run one mutation at a time so that we provide a
      // serializable experience for the end user but we will
      // eventually support mutations in parallel when we have strong
      // eventually consistent writers.
      if (
        hasRunningMutations() ||
        queuedMutations.current.length > 0 ||
        flushMutations.current !== undefined
      ) {
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<DeleteTaskResponse>>(() =>
          __DeleteTask(mutation)
        );

        // Add to localStorage here.
        queuedDeleteTaskMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedDeleteTaskMutations.current) {
            queuedDeleteTaskMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "DeleteTask", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningDeleteTaskMutations` in `__DeleteTask`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __DeleteTask(mutation);
      }
    }

    async function DeleteTask(
      partialRequest: __bufbuildProtobufPartialMessage<DeleteTaskRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<DeleteTaskResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof DeleteTaskRequest ? partialRequest : new DeleteTaskRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _DeleteTask(mutation);
    }

    useEffect(() => {
      if (abortController === undefined ) {
        return;
      }
      const loop = async () => {
        await __resembleRetryForever(async () => {
          try {// Wait for any mutations to complete before starting to
            // read so that we read the latest state including those
            // mutations.
            if (runningCreateTaskListMutations.current.length > 0 || runningAddTaskMutations.current.length > 0 || runningMoveTaskMutations.current.length > 0 || runningDeleteTaskMutations.current.length > 0) {
              // TODO(benh): check invariant
              // 'flushMutations.current !== undefined' but don't
              // throw an error since that will just retry, instead
              // add support for "bailing" from a 'retry' by calling a
              // function passed into the lambda that 'retry' takes.
              await flushMutations.current?.wait();
            }


            const responses = ReactQuery(
              __resembleQueryRequest.create({
                method: "ListTasks",
                request: requestRef.current.toBinary(),
              }),
              abortController?.signal
            );

            for await (const response of responses) {
              setIsLoading(false);

              for (const idempotencyKey of response.idempotencyKeys) {
                observedIdempotencyKeys.current.add(idempotencyKey);
              }

              // Only keep around the idempotency keys that are
              // still pending as the rest are not useful for us.
              observedIdempotencyKeys.current = __resembleFilterSet(
                observedIdempotencyKeys.current,
                (observedIdempotencyKey) =>
                  [
                  ...runningCreateTaskListMutations.current,
                  ...runningAddTaskMutations.current,
                  ...runningMoveTaskMutations.current,
                  ...runningDeleteTaskMutations.current,
                  ].some(
                    (mutation) =>
                      observedIdempotencyKey === mutation.idempotencyKey
                  )
              );

              if (flushMutations.current !== undefined) {
                // TODO(benh): check invariant
                // 'pendingMutations.current.length === 0' but don't
                // throw an error since that will just retry, instead
                // add support for "bailing" from a 'retry' by calling a
                // function passed into the lambda that 'retry' takes.

                flushMutations.current = undefined;

                // Dequeue 1 queue and run 1 mutation from it.
                for (const run of queuedMutations.current) {
                  queuedMutations.current.shift();
                  run();
                  break;
                }
              }

              setUnobservedPendingCreateTaskListMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedCreateTaskListMutations.current.some(
                        ([queuedCreateTaskListMutation]) =>
                          mutation.idempotencyKey ===
                          queuedCreateTaskListMutation.idempotencyKey
                      ) ||
                      runningCreateTaskListMutations.current.some(
                        (runningCreateTaskListMutations) =>
                          mutation.idempotencyKey ===
                          runningCreateTaskListMutations.idempotencyKey
                      )
                  )
                  .filter(
                    (mutation) =>
                      // Only keep mutations whose effects haven't been observed.
                      !observedIdempotencyKeys.current.has(
                        mutation.idempotencyKey
                      )
                  )
              )

              setUnobservedPendingAddTaskMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedAddTaskMutations.current.some(
                        ([queuedAddTaskMutation]) =>
                          mutation.idempotencyKey ===
                          queuedAddTaskMutation.idempotencyKey
                      ) ||
                      runningAddTaskMutations.current.some(
                        (runningAddTaskMutations) =>
                          mutation.idempotencyKey ===
                          runningAddTaskMutations.idempotencyKey
                      )
                  )
                  .filter(
                    (mutation) =>
                      // Only keep mutations whose effects haven't been observed.
                      !observedIdempotencyKeys.current.has(
                        mutation.idempotencyKey
                      )
                  )
              )

              setUnobservedPendingMoveTaskMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedMoveTaskMutations.current.some(
                        ([queuedMoveTaskMutation]) =>
                          mutation.idempotencyKey ===
                          queuedMoveTaskMutation.idempotencyKey
                      ) ||
                      runningMoveTaskMutations.current.some(
                        (runningMoveTaskMutations) =>
                          mutation.idempotencyKey ===
                          runningMoveTaskMutations.idempotencyKey
                      )
                  )
                  .filter(
                    (mutation) =>
                      // Only keep mutations whose effects haven't been observed.
                      !observedIdempotencyKeys.current.has(
                        mutation.idempotencyKey
                      )
                  )
              )

              setUnobservedPendingDeleteTaskMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedDeleteTaskMutations.current.some(
                        ([queuedDeleteTaskMutation]) =>
                          mutation.idempotencyKey ===
                          queuedDeleteTaskMutation.idempotencyKey
                      ) ||
                      runningDeleteTaskMutations.current.some(
                        (runningDeleteTaskMutations) =>
                          mutation.idempotencyKey ===
                          runningDeleteTaskMutations.idempotencyKey
                      )
                  )
                  .filter(
                    (mutation) =>
                      // Only keep mutations whose effects haven't been observed.
                      !observedIdempotencyKeys.current.has(
                        mutation.idempotencyKey
                      )
                  )
              )


              setResponse(ListTasksResponse.fromBinary(response.response));
            }
          } catch (e: unknown) {
            if (abortController?.signal.aborted) {
              return;
            }

            setError(e);
            setIsLoading(true);

            // Run a mutation in the event that we are trying to read
            // from an unconstructed actor and the mutation will peform
            // the construction.
            //
            // TODO(benh): only do this if the reason we failed to
            // read was because the actor does not exist.
            for (const run of queuedMutations.current) {
              queuedMutations.current.shift();
              run();
              break;
            }

            // TODO(benh): check invariant
            // 'flushMutations.current === undefined' but don't
            // throw an error since that will just retry, instead
            // add support for "bailing" from a 'retry' by calling a
            // function passed into the lambda that 'retry' takes.
            flushMutations.current = new __resembleReactEvent();

            throw e;
          }
        });
      };

      loop();
    }, [abortController]);

    return {
      response,
      isLoading,
      error,
      mutations: {
        CreateTaskList,
        AddTask,
        MoveTask,
        DeleteTask,
      },
      pendingCreateTaskListMutations: unobservedPendingCreateTaskListMutations,
      failedCreateTaskListMutations,
      recoveredCreateTaskListMutations: recoveredCreateTaskListMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
      pendingAddTaskMutations: unobservedPendingAddTaskMutations,
      failedAddTaskMutations,
      recoveredAddTaskMutations: recoveredAddTaskMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
      pendingMoveTaskMutations: unobservedPendingMoveTaskMutations,
      failedMoveTaskMutations,
      recoveredMoveTaskMutations: recoveredMoveTaskMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
      pendingDeleteTaskMutations: unobservedPendingDeleteTaskMutations,
      failedDeleteTaskMutations,
      recoveredDeleteTaskMutations: recoveredDeleteTaskMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
    };
  };


  const AddTask = async (partialRequest: __bufbuildProtobufPartialMessage<AddTaskRequest> = {}) => {
    const request = partialRequest instanceof AddTaskRequest ? partialRequest : new AddTaskRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.AddTask", "POST"));

    return await response.json();
  };

  const MoveTask = async (partialRequest: __bufbuildProtobufPartialMessage<MoveTaskRequest> = {}) => {
    const request = partialRequest instanceof MoveTaskRequest ? partialRequest : new MoveTaskRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.MoveTask", "POST"));

    return await response.json();
  };

  const DeleteTask = async (partialRequest: __bufbuildProtobufPartialMessage<DeleteTaskRequest> = {}) => {
    const request = partialRequest instanceof DeleteTaskRequest ? partialRequest : new DeleteTaskRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.DeleteTask", "POST"));

    return await response.json();
  };


async function _Mutation<
    Request extends
CreateTaskListRequest    |AddTaskRequest    |MoveTaskRequest    |DeleteTaskRequest,
    Response extends    CreateTaskListResponse    |    AddTaskResponse    |    MoveTaskResponse    |    DeleteTaskResponse  >(
    path: string,
    mutation: __resembleMutation<Request>,
    request: Request,
    idempotencyKey: string,
    setUnobservedPendingMutations: Dispatch<
      SetStateAction<__resembleMutation<Request>[]>
    >,
    abortController: AbortController | undefined,
    shouldClearFailedMutations: MutableRefObject<boolean>,
    setFailedMutations: Dispatch<SetStateAction<__resembleMutation<Request>[]>>,
    runningMutations: MutableRefObject<__resembleMutation<Request>[]>,
    flushMutations: MutableRefObject<__resembleReactEvent | undefined>,
    queuedMutations: MutableRefObject<Array<() => void>>,
    requestType: { new (request: Request): Request },
    responseTypeFromJson: (json: any) => Response
  ): Promise<__resembleResponseOrError<Response>> {

    try {
      return await __resembleRetryForever(
        async () => {
          try {
            setUnobservedPendingMutations(
              (mutations) => {
                return mutations.map((mutation) => {
                  if (mutation.idempotencyKey === idempotencyKey) {
                    return { ...mutation, isLoading: true };
                  }
                  return mutation;
                });
              }
            );
            const req: Request =
              request instanceof requestType
                ? request
                : new requestType(request);

            const response = await guardedFetch(
              newRequest(req.toJson(), path, "POST", idempotencyKey),
              { signal: abortController?.signal }
            );

            if (!response.ok && response.headers.has("grpc-status")) {
              const grpcStatus = response.headers.get("grpc-status");
              let grpcMessage = response.headers.get("grpc-message");
              const error = new Error(
                `'twentyfive.TwentyFive' for '${id}' responded ` +
                  `with status ${grpcStatus}` +
                  `${grpcMessage !== null ? ": " + grpcMessage : ""}`
              );

              if (shouldClearFailedMutations.current) {
                shouldClearFailedMutations.current = false;
                setFailedMutations([
                  { request, idempotencyKey, isLoading: false, error },
                ]);
              } else {
                setFailedMutations((failedMutations) => [
                  ...failedMutations,
                  { request, idempotencyKey, isLoading: false, error },
                ]);
              }
              setUnobservedPendingMutations(
                (mutations) =>
                  mutations.filter(
                    (mutation) => mutation.idempotencyKey !== idempotencyKey
                  )
              );

              return { error } as __resembleResponseOrError<Response>;
            }
            if (!response.ok) {
              throw new Error("Failed to fetch");
            }
            const jsonResponse = await response.json();
            return {
              response: responseTypeFromJson(jsonResponse),
            };
          } catch (e: unknown) {
            setUnobservedPendingMutations(
              (mutations) =>
                mutations.map((mutation) => {
                  if (mutation.idempotencyKey === idempotencyKey) {
                    return { ...mutation, error: e, isLoading: false };
                  } else {
                    return mutation;
                  }
                })
            );

            if (abortController?.signal.aborted) {
              // TODO(benh): instead of returning 'undefined' as a
              // means of knowing that we've aborted provide a way
              // of "bailing" from a 'retry' by calling a function
              // passed into the lambda that 'retry' takes.
              return { error: new Error("Aborted") };
            } else {
              throw e;
            }
          }
        },
        {
          maxBackoffSeconds: 3,
        }
      );
    } finally {
      // NOTE: we deliberately DO NOT remove from
      // 'unobservedPendingMutations' but instead wait
      // for a response first so that we don't cause a render
      // before getting the updated state from the server.

      if (
        flushMutations.current !== undefined &&
        runningMutations.current.length === 0
      ) {
        flushMutations.current.set();
      } else {
        // Dequeue 1 queue and run 1 mutation from it.
        for (const run of queuedMutations.current) {
          queuedMutations.current.shift();
          run();
          break;
        }
      }
    }
  }

  async function* ReactQuery(
    request: __resembleIQueryRequest,
    signal: AbortSignal
  ): AsyncGenerator<__resembleIQueryResponse, void, unknown> {
    const response = await guardedFetch(
      newRequest(__resembleQueryRequest.toJson(request), "/query", "POST"),
      { signal: signal }
    );

    if (response.body == null) {
      throw new Error("Unable to read body of response");
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    if (reader === undefined) {
      throw new Error("Not able to instantiate reader on response body");
    }

    let accumulated = "";

    while (true) {
      const { value, done } = await reader.read();

      if (!response.ok && response.headers.has("grpc-status")) {
        const grpcStatus = response.headers.get("grpc-status");
        let grpcMessage = response.headers.get("grpc-message");
        throw new Error(
          `'ReactQuery responded ` +
            `with status ${grpcStatus}` +
            `${grpcMessage !== null ? ": " + grpcMessage : ""}`
        );
      } else if (!response.ok) {
        throw new Error(
          `'ReactQuery' failed: ${value}`
        );
      } else if (done) {
        break;
      } else {
        accumulated += value.trim();

        if (accumulated.startsWith(",")) {
          accumulated = accumulated.substring(1);
        }

        if (!accumulated.startsWith("[")) {
          accumulated = "[" + accumulated;
        }

        if (!accumulated.endsWith("]")) {
          accumulated = accumulated + "]";
        }

        try {
          const json = JSON.parse(accumulated);
          accumulated = "";
          yield __resembleQueryResponse.fromJson(json.at(-1));
        } catch (e) {
          if (e instanceof SyntaxError) {
            accumulated = accumulated.substring(0, accumulated.length - 1);
            continue;
          } else {
            throw e;
          }
        }
      }
    }
  }

  return {
    CreateTaskList,
    ListTasks,
    useListTasks,
    AddTask,
    MoveTask,
    DeleteTask,
  };
};


