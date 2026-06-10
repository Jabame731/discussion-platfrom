// import { useDispatch, useSelector } from "react-redux";
// import {
//   loadProtocolsEffect,
//   loadProtocolEffect,
//   createProtocolEffect,
//   updateProtocolEffect,
//   deleteProtocolEffect,
//   loadReviewsEffect,
//   createReviewEffect,
//   loadProtocolThreadsEffect,
//   type AppDispatch,
// } from "../data/store";
// import * as ProtocolSelectors from "../data/store/selectors";
// import type {
//   CreateProtocolPayload,
//   CreateReviewPayload,
//   ProtocolListParams,
//   UpdateProtocolPayload,
// } from "../data/models";

// export function useProtocolUsecase() {
//   const dispatch = useDispatch<AppDispatch>();

//   // Many
//   const protocols = useSelector(ProtocolSelectors.selectProtocols);
//   const loading = useSelector(ProtocolSelectors.selectProtocolsLoading);
//   const loaded = useSelector(ProtocolSelectors.selectProtocolsLoaded);
//   const error = useSelector(ProtocolSelectors.selectProtocolsError);
//   const total = useSelector(ProtocolSelectors.selectProtocolsTotal);

//   const loadProtocols = (params?: ProtocolListParams) => {
//     dispatch(loadProtocolsEffect(params));
//   };

//   // Single
//   const selected = useSelector(ProtocolSelectors.selectSelectedProtocol);
//   const loadingSelected = useSelector(
//     ProtocolSelectors.selectSelectedProtocolLoading,
//   );
//   const loadedSelected = useSelector(
//     ProtocolSelectors.selectSelectedProtocolLoaded,
//   );
//   const errorSelected = useSelector(
//     ProtocolSelectors.selectSelectedProtocolError,
//   );

//   const loadProtocol = (slug: string | number) => {
//     dispatch(loadProtocolEffect(slug));
//   };

//   const createProtocol = (payload: CreateProtocolPayload) => {
//     dispatch(createProtocolEffect(payload));
//   };

//   const updateProtocol = (id: number, payload: UpdateProtocolPayload) => {
//     dispatch(updateProtocolEffect(id, payload));
//   };

//   const deleteProtocol = (id: number) => {
//     dispatch(deleteProtocolEffect(id));
//   };

//   // Reviews
//   const reviewsLoading = useSelector(ProtocolSelectors.selectReviewsLoading);
//   const reviewsLoaded = useSelector(ProtocolSelectors.selectReviewsLoaded);
//   const reviewsError = useSelector(ProtocolSelectors.selectReviewsError);

//   const loadReviews = (protocolId: number | string) => {
//     dispatch(loadReviewsEffect(protocolId));
//   };

//   const createReview = (
//     protocolId: number | string,
//     payload: CreateReviewPayload,
//   ) => {
//     dispatch(createReviewEffect(protocolId, payload));
//   };

//   // Threads
//   const threadsLoading = useSelector(ProtocolSelectors.selectThreadsLoading);
//   const threadsLoaded = useSelector(ProtocolSelectors.selectThreadsLoaded);
//   const threadsError = useSelector(ProtocolSelectors.selectThreadsError);

//   const loadThreads = (protocolId: number | string) => {
//     dispatch(loadProtocolThreadsEffect(protocolId));
//   };

//   console.log(reviewsLoaded);

//   return {
//     // many
//     protocols,
//     loading,
//     loaded,
//     error,
//     total,
//     loadProtocols,
//     // single
//     selected,
//     loadingSelected,
//     loadedSelected,
//     errorSelected,
//     loadProtocol,
//     createProtocol,
//     updateProtocol,
//     deleteProtocol,
//     // reviews
//     reviewsLoading,
//     reviewsLoaded,
//     reviewsError,
//     loadReviews,
//     createReview,
//     // threads
//     threadsLoading,
//     threadsLoaded,
//     threadsError,
//     loadThreads,
//   };
// }

// // Separate hooks for per-protocol data since they require an id parameter
// export function useProtocolReviews(protocolId: number | string) {
//   const dispatch = useDispatch<AppDispatch>();

//   const reviews = useSelector(
//     ProtocolSelectors.selectReviewsDataByProtocolId(protocolId),
//   );
//   const reviewsPaginated = useSelector(
//     ProtocolSelectors.selectReviewsByProtocolId(protocolId),
//   );
//   const total = useSelector(
//     ProtocolSelectors.selectReviewsTotalByProtocolId(protocolId),
//   );
//   const loading = useSelector(ProtocolSelectors.selectReviewsLoading);
//   const loaded = useSelector(ProtocolSelectors.selectReviewsLoaded);
//   const error = useSelector(ProtocolSelectors.selectReviewsError);

//   const loadReviews = () => dispatch(loadReviewsEffect(protocolId));
//   const createReview = (payload: CreateReviewPayload) =>
//     dispatch(createReviewEffect(protocolId, payload));

//   console.log("revoews", reviews);

//   return {
//     reviews,
//     reviewsPaginated,
//     total,
//     loading,
//     loaded,
//     error,
//     loadReviews,
//     createReview,
//   };
// }

// export function useProtocolThreads(protocolId: number | string) {
//   const dispatch = useDispatch<AppDispatch>();

//   const threads = useSelector(
//     ProtocolSelectors.selectThreadsDataByProtocolId(protocolId),
//   );
//   const threadsPaginated = useSelector(
//     ProtocolSelectors.selectThreadsByProtocolId(protocolId),
//   );
//   const total = useSelector(
//     ProtocolSelectors.selectThreadsTotalByProtocolId(protocolId),
//   );
//   const loading = useSelector(ProtocolSelectors.selectThreadsLoading);
//   const loaded = useSelector(ProtocolSelectors.selectThreadsLoaded);
//   const error = useSelector(ProtocolSelectors.selectThreadsError);

//   const loadThreads = () => dispatch(loadProtocolThreadsEffect(protocolId));

//   return {
//     threads,
//     threadsPaginated,
//     total,
//     loading,
//     loaded,
//     error,
//     loadThreads,
//   };
// }
