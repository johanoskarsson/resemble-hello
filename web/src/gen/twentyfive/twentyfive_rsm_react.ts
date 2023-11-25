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
} from "./twentyfive_pb";

// Additionally re-export all messages from the pb module.
export {
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
  CreateGoalList: (partialRequest?: __bufbuildProtobufPartialMessage<CreateGoalListRequest>) =>
  Promise<CreateGoalListResponse>;
  ListGoals: (partialRequest?: __bufbuildProtobufPartialMessage<ListGoalsRequest>) =>
  Promise<ListGoalsResponse>;
  AddGoal: (partialRequest?: __bufbuildProtobufPartialMessage<AddGoalRequest>) =>
  Promise<AddGoalResponse>;
  MoveGoal: (partialRequest?: __bufbuildProtobufPartialMessage<MoveGoalRequest>) =>
  Promise<MoveGoalResponse>;
  DeleteGoal: (partialRequest?: __bufbuildProtobufPartialMessage<DeleteGoalRequest>) =>
  Promise<DeleteGoalResponse>;
  useListGoals: (partialRequest?: __bufbuildProtobufPartialMessage<ListGoalsRequest>) => {
   response: ListGoalsResponse | undefined;
    isLoading: boolean;
    error: unknown;
    mutations: {
       CreateGoalList: (request: __bufbuildProtobufPartialMessage<CreateGoalListRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<CreateGoalListResponse>>;
       AddGoal: (request: __bufbuildProtobufPartialMessage<AddGoalRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<AddGoalResponse>>;
       MoveGoal: (request: __bufbuildProtobufPartialMessage<MoveGoalRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<MoveGoalResponse>>;
       DeleteGoal: (request: __bufbuildProtobufPartialMessage<DeleteGoalRequest>,
       optimistic_metadata?: any ) =>
      Promise<__resembleResponseOrError<DeleteGoalResponse>>;
    };
      pendingCreateGoalListMutations: {
        request: CreateGoalListRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedCreateGoalListMutations: {
        request: CreateGoalListRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredCreateGoalListMutations: {
        request: CreateGoalListRequest;
        idempotencyKey: string;
        run: () => void;
      }[];
      pendingAddGoalMutations: {
        request: AddGoalRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedAddGoalMutations: {
        request: AddGoalRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredAddGoalMutations: {
        request: AddGoalRequest;
        idempotencyKey: string;
        run: () => void;
      }[];
      pendingMoveGoalMutations: {
        request: MoveGoalRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedMoveGoalMutations: {
        request: MoveGoalRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredMoveGoalMutations: {
        request: MoveGoalRequest;
        idempotencyKey: string;
        run: () => void;
      }[];
      pendingDeleteGoalMutations: {
        request: DeleteGoalRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
        optimistic_metadata?: any;
      }[];
      failedDeleteGoalMutations: {
        request: DeleteGoalRequest;
        idempotencyKey: string;
        isLoading: boolean;
        error?: unknown;
      }[];
      recoveredDeleteGoalMutations: {
        request: DeleteGoalRequest;
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

  const CreateGoalList = async (partialRequest: __bufbuildProtobufPartialMessage<CreateGoalListRequest> = {}) => {
    const request = partialRequest instanceof CreateGoalListRequest ? partialRequest : new CreateGoalListRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.CreateGoalList", "POST"));

    return await response.json();
  };

  const ListGoals = async (partialRequest: __bufbuildProtobufPartialMessage<ListGoalsRequest> = {}) => {
    const request = partialRequest instanceof ListGoalsRequest ? partialRequest : new ListGoalsRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.ListGoals", "POST"));

    if (!response.ok && response.headers.has("grpc-status")) {
      const grpcStatus = response.headers.get("grpc-status");
      let grpcMessage = response.headers.get("grpc-message");
      throw new Error(
        `'twentyfive.TwentyFive.ListGoals' for '${id}' responded ` +
          `with status ${grpcStatus}` +
          `${grpcMessage !== null ? ": " + grpcMessage : ""}`
      );
    } else if (!response.ok) {
      throw new Error(
        `'twentyfive.TwentyFive.ListGoals' failed: ${response.body}`
      );
    }

    return await response.json();
  };

  const useListGoals = (partialRequest: __bufbuildProtobufPartialMessage<ListGoalsRequest> = {}) => {
    const [response, setResponse] = useState<ListGoalsResponse>();
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

    const request = partialRequest instanceof ListGoalsRequest
        ? partialRequest
        : new ListGoalsRequest(partialRequest);

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
      runningCreateGoalListMutations.current.length > 0||
      runningAddGoalMutations.current.length > 0||
      runningMoveGoalMutations.current.length > 0||
      runningDeleteGoalMutations.current.length > 0) {
        return true;
      }
      return false;
    }


    const runningCreateGoalListMutations = useRef<__resembleMutation<CreateGoalListRequest>[]>([]);
    const recoveredCreateGoalListMutations = useRef<
      [__resembleMutation<CreateGoalListRequest>, () => void][]
    >([]);
    const shouldClearFailedCreateGoalListMutations = useRef(false);
    const [failedCreateGoalListMutations, setFailedCreateGoalListMutations] = useState<
      __resembleMutation<CreateGoalListRequest>[]
    >([]);
    const queuedCreateGoalListMutations = useRef<[__resembleMutation<CreateGoalListRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeCreateGoalListMutations = (): [
      __resembleMutation<CreateGoalListRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = CreateGoalList
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<CreateGoalListRequest>[] = JSON.parse(value);
      const recoveredCreateGoalListMutations: [
        __resembleMutation<CreateGoalListRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredCreateGoalListMutations.push([mutation, () => __CreateGoalList(mutation)]);
      }
      return recoveredCreateGoalListMutations;
    }
    const doOnceCreateGoalList = useRef(true)
    if (doOnceCreateGoalList.current) {
      doOnceCreateGoalList.current = false
      recoveredCreateGoalListMutations.current = recoverAndPurgeCreateGoalListMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingCreateGoalListMutations, setUnobservedPendingCreateGoalListMutations] =
      useState<__resembleMutation<CreateGoalListRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedCreateGoalListMutations.current = true;
    }, [failedCreateGoalListMutations]);

    async function __CreateGoalList(
      mutation: __resembleMutation<CreateGoalListRequest>
    ): Promise<__resembleResponseOrError<CreateGoalListResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningCreateGoalListMutations
        runningCreateGoalListMutations.current.push(mutation)
        return _Mutation<CreateGoalListRequest, CreateGoalListResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.CreateGoalList",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingCreateGoalListMutations,
          abortController,
          shouldClearFailedCreateGoalListMutations,
          setFailedCreateGoalListMutations,
          runningCreateGoalListMutations,
          flushMutations,
          queuedMutations,
          CreateGoalListRequest,
          CreateGoalListResponse.fromJson
        );
      } finally {
        runningCreateGoalListMutations.current = runningCreateGoalListMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "CreateGoalList",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _CreateGoalList(mutation: __resembleMutation<CreateGoalListRequest>) {
      setUnobservedPendingCreateGoalListMutations(
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
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<CreateGoalListResponse>>(() =>
          __CreateGoalList(mutation)
        );

        // Add to localStorage here.
        queuedCreateGoalListMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedCreateGoalListMutations.current) {
            queuedCreateGoalListMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "CreateGoalList", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningCreateGoalListMutations` in `__CreateGoalList`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __CreateGoalList(mutation);
      }
    }

    async function CreateGoalList(
      partialRequest: __bufbuildProtobufPartialMessage<CreateGoalListRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<CreateGoalListResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof CreateGoalListRequest ? partialRequest : new CreateGoalListRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _CreateGoalList(mutation);
    }

    const runningAddGoalMutations = useRef<__resembleMutation<AddGoalRequest>[]>([]);
    const recoveredAddGoalMutations = useRef<
      [__resembleMutation<AddGoalRequest>, () => void][]
    >([]);
    const shouldClearFailedAddGoalMutations = useRef(false);
    const [failedAddGoalMutations, setFailedAddGoalMutations] = useState<
      __resembleMutation<AddGoalRequest>[]
    >([]);
    const queuedAddGoalMutations = useRef<[__resembleMutation<AddGoalRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeAddGoalMutations = (): [
      __resembleMutation<AddGoalRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = AddGoal
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<AddGoalRequest>[] = JSON.parse(value);
      const recoveredAddGoalMutations: [
        __resembleMutation<AddGoalRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredAddGoalMutations.push([mutation, () => __AddGoal(mutation)]);
      }
      return recoveredAddGoalMutations;
    }
    const doOnceAddGoal = useRef(true)
    if (doOnceAddGoal.current) {
      doOnceAddGoal.current = false
      recoveredAddGoalMutations.current = recoverAndPurgeAddGoalMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingAddGoalMutations, setUnobservedPendingAddGoalMutations] =
      useState<__resembleMutation<AddGoalRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedAddGoalMutations.current = true;
    }, [failedAddGoalMutations]);

    async function __AddGoal(
      mutation: __resembleMutation<AddGoalRequest>
    ): Promise<__resembleResponseOrError<AddGoalResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningAddGoalMutations
        runningAddGoalMutations.current.push(mutation)
        return _Mutation<AddGoalRequest, AddGoalResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.AddGoal",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingAddGoalMutations,
          abortController,
          shouldClearFailedAddGoalMutations,
          setFailedAddGoalMutations,
          runningAddGoalMutations,
          flushMutations,
          queuedMutations,
          AddGoalRequest,
          AddGoalResponse.fromJson
        );
      } finally {
        runningAddGoalMutations.current = runningAddGoalMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "AddGoal",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _AddGoal(mutation: __resembleMutation<AddGoalRequest>) {
      setUnobservedPendingAddGoalMutations(
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
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<AddGoalResponse>>(() =>
          __AddGoal(mutation)
        );

        // Add to localStorage here.
        queuedAddGoalMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedAddGoalMutations.current) {
            queuedAddGoalMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "AddGoal", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningAddGoalMutations` in `__AddGoal`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __AddGoal(mutation);
      }
    }

    async function AddGoal(
      partialRequest: __bufbuildProtobufPartialMessage<AddGoalRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<AddGoalResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof AddGoalRequest ? partialRequest : new AddGoalRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _AddGoal(mutation);
    }

    const runningMoveGoalMutations = useRef<__resembleMutation<MoveGoalRequest>[]>([]);
    const recoveredMoveGoalMutations = useRef<
      [__resembleMutation<MoveGoalRequest>, () => void][]
    >([]);
    const shouldClearFailedMoveGoalMutations = useRef(false);
    const [failedMoveGoalMutations, setFailedMoveGoalMutations] = useState<
      __resembleMutation<MoveGoalRequest>[]
    >([]);
    const queuedMoveGoalMutations = useRef<[__resembleMutation<MoveGoalRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeMoveGoalMutations = (): [
      __resembleMutation<MoveGoalRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = MoveGoal
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<MoveGoalRequest>[] = JSON.parse(value);
      const recoveredMoveGoalMutations: [
        __resembleMutation<MoveGoalRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredMoveGoalMutations.push([mutation, () => __MoveGoal(mutation)]);
      }
      return recoveredMoveGoalMutations;
    }
    const doOnceMoveGoal = useRef(true)
    if (doOnceMoveGoal.current) {
      doOnceMoveGoal.current = false
      recoveredMoveGoalMutations.current = recoverAndPurgeMoveGoalMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingMoveGoalMutations, setUnobservedPendingMoveGoalMutations] =
      useState<__resembleMutation<MoveGoalRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedMoveGoalMutations.current = true;
    }, [failedMoveGoalMutations]);

    async function __MoveGoal(
      mutation: __resembleMutation<MoveGoalRequest>
    ): Promise<__resembleResponseOrError<MoveGoalResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningMoveGoalMutations
        runningMoveGoalMutations.current.push(mutation)
        return _Mutation<MoveGoalRequest, MoveGoalResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.MoveGoal",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingMoveGoalMutations,
          abortController,
          shouldClearFailedMoveGoalMutations,
          setFailedMoveGoalMutations,
          runningMoveGoalMutations,
          flushMutations,
          queuedMutations,
          MoveGoalRequest,
          MoveGoalResponse.fromJson
        );
      } finally {
        runningMoveGoalMutations.current = runningMoveGoalMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "MoveGoal",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _MoveGoal(mutation: __resembleMutation<MoveGoalRequest>) {
      setUnobservedPendingMoveGoalMutations(
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
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<MoveGoalResponse>>(() =>
          __MoveGoal(mutation)
        );

        // Add to localStorage here.
        queuedMoveGoalMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedMoveGoalMutations.current) {
            queuedMoveGoalMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "MoveGoal", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningMoveGoalMutations` in `__MoveGoal`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __MoveGoal(mutation);
      }
    }

    async function MoveGoal(
      partialRequest: __bufbuildProtobufPartialMessage<MoveGoalRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<MoveGoalResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof MoveGoalRequest ? partialRequest : new MoveGoalRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _MoveGoal(mutation);
    }

    const runningDeleteGoalMutations = useRef<__resembleMutation<DeleteGoalRequest>[]>([]);
    const recoveredDeleteGoalMutations = useRef<
      [__resembleMutation<DeleteGoalRequest>, () => void][]
    >([]);
    const shouldClearFailedDeleteGoalMutations = useRef(false);
    const [failedDeleteGoalMutations, setFailedDeleteGoalMutations] = useState<
      __resembleMutation<DeleteGoalRequest>[]
    >([]);
    const queuedDeleteGoalMutations = useRef<[__resembleMutation<DeleteGoalRequest>, () => void][]>(
      []
    );
    const recoverAndPurgeDeleteGoalMutations = (): [
      __resembleMutation<DeleteGoalRequest>,
      () => void
    ][] => {
      if (localStorageKeyRef.current === undefined) {
        return [];
      }
      const suffix = DeleteGoal
      const value = localStorage.getItem(localStorageKeyRef.current + suffix);
      if (value === null) {
        return [];
      }

      localStorage.removeItem(localStorageKeyRef.current);
      const mutations: __resembleMutation<DeleteGoalRequest>[] = JSON.parse(value);
      const recoveredDeleteGoalMutations: [
        __resembleMutation<DeleteGoalRequest>,
        () => void
      ][] = [];
      for (const mutation of mutations) {
        recoveredDeleteGoalMutations.push([mutation, () => __DeleteGoal(mutation)]);
      }
      return recoveredDeleteGoalMutations;
    }
    const doOnceDeleteGoal = useRef(true)
    if (doOnceDeleteGoal.current) {
      doOnceDeleteGoal.current = false
      recoveredDeleteGoalMutations.current = recoverAndPurgeDeleteGoalMutations()
    }

    // User facing state that only includes the pending mutations that
    // have not been observed.
    const [unobservedPendingDeleteGoalMutations, setUnobservedPendingDeleteGoalMutations] =
      useState<__resembleMutation<DeleteGoalRequest>[]>([]);

    useEffect(() => {
      shouldClearFailedDeleteGoalMutations.current = true;
    }, [failedDeleteGoalMutations]);

    async function __DeleteGoal(
      mutation: __resembleMutation<DeleteGoalRequest>
    ): Promise<__resembleResponseOrError<DeleteGoalResponse>> {
      try {
        // Invariant that we won't yield to event loop before pushing to
        // runningDeleteGoalMutations
        runningDeleteGoalMutations.current.push(mutation)
        return _Mutation<DeleteGoalRequest, DeleteGoalResponse>(
          // Invariant here is that we use the '/package.service.method'.
          //
          // See also 'resemble/helpers.py'.
          "/twentyfive.TwentyFive.DeleteGoal",
          mutation,
          mutation.request,
          mutation.idempotencyKey,
          setUnobservedPendingDeleteGoalMutations,
          abortController,
          shouldClearFailedDeleteGoalMutations,
          setFailedDeleteGoalMutations,
          runningDeleteGoalMutations,
          flushMutations,
          queuedMutations,
          DeleteGoalRequest,
          DeleteGoalResponse.fromJson
        );
      } finally {
        runningDeleteGoalMutations.current = runningDeleteGoalMutations.current.filter(
          ({ idempotencyKey }) => mutation.idempotencyKey !== idempotencyKey
        );

        __resemblePopMutationMaybeFromLocalStorage(
          localStorageKeyRef.current,
          "DeleteGoal",
          (mutationRequest: __resembleMutation<Request>) =>
            mutationRequest.idempotencyKey !== mutation.idempotencyKey
        );


      }
    }
    async function _DeleteGoal(mutation: __resembleMutation<DeleteGoalRequest>) {
      setUnobservedPendingDeleteGoalMutations(
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
        const deferred = new __resembleReactDeferred<__resembleResponseOrError<DeleteGoalResponse>>(() =>
          __DeleteGoal(mutation)
        );

        // Add to localStorage here.
        queuedDeleteGoalMutations.current.push([mutation, () => deferred.start()]);
        queuedMutations.current.push(() => {
          for (const [, run] of queuedDeleteGoalMutations.current) {
            queuedDeleteGoalMutations.current.shift();
            run();
            break;
          }
        });
        // Maybe add to localStorage.
        __resemblePushMutationMaybeToLocalStorage(localStorageKeyRef.current, "DeleteGoal", mutation);

        return deferred.promise;
      } else {
        // NOTE: we'll add this mutation to `runningDeleteGoalMutations` in `__DeleteGoal`
        // without yielding to event loop so that we are guaranteed atomicity with checking `hasRunningMutations()`.
        return await __DeleteGoal(mutation);
      }
    }

    async function DeleteGoal(
      partialRequest: __bufbuildProtobufPartialMessage<DeleteGoalRequest>, optimistic_metadata?: any
    ): Promise<__resembleResponseOrError<DeleteGoalResponse>> {
      const idempotencyKey = uuidv4();
      const request = partialRequest instanceof DeleteGoalRequest ? partialRequest : new DeleteGoalRequest(partialRequest);

      const mutation = {
        request,
        idempotencyKey,
        optimistic_metadata,
        isLoading: false, // Won't start loading if we're flushing mutations.
      };

      return _DeleteGoal(mutation);
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
            if (runningCreateGoalListMutations.current.length > 0 || runningAddGoalMutations.current.length > 0 || runningMoveGoalMutations.current.length > 0 || runningDeleteGoalMutations.current.length > 0) {
              // TODO(benh): check invariant
              // 'flushMutations.current !== undefined' but don't
              // throw an error since that will just retry, instead
              // add support for "bailing" from a 'retry' by calling a
              // function passed into the lambda that 'retry' takes.
              await flushMutations.current?.wait();
            }


            const responses = ReactQuery(
              __resembleQueryRequest.create({
                method: "ListGoals",
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
                  ...runningCreateGoalListMutations.current,
                  ...runningAddGoalMutations.current,
                  ...runningMoveGoalMutations.current,
                  ...runningDeleteGoalMutations.current,
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

              setUnobservedPendingCreateGoalListMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedCreateGoalListMutations.current.some(
                        ([queuedCreateGoalListMutation]) =>
                          mutation.idempotencyKey ===
                          queuedCreateGoalListMutation.idempotencyKey
                      ) ||
                      runningCreateGoalListMutations.current.some(
                        (runningCreateGoalListMutations) =>
                          mutation.idempotencyKey ===
                          runningCreateGoalListMutations.idempotencyKey
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

              setUnobservedPendingAddGoalMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedAddGoalMutations.current.some(
                        ([queuedAddGoalMutation]) =>
                          mutation.idempotencyKey ===
                          queuedAddGoalMutation.idempotencyKey
                      ) ||
                      runningAddGoalMutations.current.some(
                        (runningAddGoalMutations) =>
                          mutation.idempotencyKey ===
                          runningAddGoalMutations.idempotencyKey
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

              setUnobservedPendingMoveGoalMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedMoveGoalMutations.current.some(
                        ([queuedMoveGoalMutation]) =>
                          mutation.idempotencyKey ===
                          queuedMoveGoalMutation.idempotencyKey
                      ) ||
                      runningMoveGoalMutations.current.some(
                        (runningMoveGoalMutations) =>
                          mutation.idempotencyKey ===
                          runningMoveGoalMutations.idempotencyKey
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

              setUnobservedPendingDeleteGoalMutations(
              (mutations) =>
                mutations
                  .filter(
                    (mutation) =>
                      // Only keep mutations that are queued, pending or
                      // recovered.
                      queuedDeleteGoalMutations.current.some(
                        ([queuedDeleteGoalMutation]) =>
                          mutation.idempotencyKey ===
                          queuedDeleteGoalMutation.idempotencyKey
                      ) ||
                      runningDeleteGoalMutations.current.some(
                        (runningDeleteGoalMutations) =>
                          mutation.idempotencyKey ===
                          runningDeleteGoalMutations.idempotencyKey
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


              setResponse(ListGoalsResponse.fromBinary(response.response));
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
        CreateGoalList,
        AddGoal,
        MoveGoal,
        DeleteGoal,
      },
      pendingCreateGoalListMutations: unobservedPendingCreateGoalListMutations,
      failedCreateGoalListMutations,
      recoveredCreateGoalListMutations: recoveredCreateGoalListMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
      pendingAddGoalMutations: unobservedPendingAddGoalMutations,
      failedAddGoalMutations,
      recoveredAddGoalMutations: recoveredAddGoalMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
      pendingMoveGoalMutations: unobservedPendingMoveGoalMutations,
      failedMoveGoalMutations,
      recoveredMoveGoalMutations: recoveredMoveGoalMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
      pendingDeleteGoalMutations: unobservedPendingDeleteGoalMutations,
      failedDeleteGoalMutations,
      recoveredDeleteGoalMutations: recoveredDeleteGoalMutations.current.map(
        ([mutation, run]) => ({ ...mutation, run: run })
      ),
    };
  };


  const AddGoal = async (partialRequest: __bufbuildProtobufPartialMessage<AddGoalRequest> = {}) => {
    const request = partialRequest instanceof AddGoalRequest ? partialRequest : new AddGoalRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.AddGoal", "POST"));

    return await response.json();
  };

  const MoveGoal = async (partialRequest: __bufbuildProtobufPartialMessage<MoveGoalRequest> = {}) => {
    const request = partialRequest instanceof MoveGoalRequest ? partialRequest : new MoveGoalRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.MoveGoal", "POST"));

    return await response.json();
  };

  const DeleteGoal = async (partialRequest: __bufbuildProtobufPartialMessage<DeleteGoalRequest> = {}) => {
    const request = partialRequest instanceof DeleteGoalRequest ? partialRequest : new DeleteGoalRequest(partialRequest);
    const requestBody = request.toJson();
    // Invariant here is that we use the '/package.service.method' path and
    // HTTP 'POST' method (we need 'POST' because we send an HTTP body).
    //
    // See also 'resemble/helpers.py'.
    const response = await guardedFetch(
      newRequest(requestBody, "/twentyfive.TwentyFive.DeleteGoal", "POST"));

    return await response.json();
  };


async function _Mutation<
    Request extends
CreateGoalListRequest    |AddGoalRequest    |MoveGoalRequest    |DeleteGoalRequest,
    Response extends    CreateGoalListResponse    |    AddGoalResponse    |    MoveGoalResponse    |    DeleteGoalResponse  >(
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
    CreateGoalList,
    ListGoals,
    useListGoals,
    AddGoal,
    MoveGoal,
    DeleteGoal,
  };
};


