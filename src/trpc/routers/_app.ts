import { categoriesRouter } from "@/modules/categories/server/procedures";
import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { videoViewsRouter } from "@/modules/videos/video-views/server/procedures";
import { videoReactionsRouter } from "@/modules/videos/video-reactions/server/procedures";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { commentReactionsRouter } from "@/modules/comments/comment-reactions/server/procedures";
import { suggestionsRouter } from "@/modules/suggestions/server/procedures";
import { searchRouter } from "@/modules/search/server/procedures";
import { playListsRouter } from "@/modules/playlists/server/procedures";
import { userRouter } from "@/modules/users/server/procedure";
export const appRouter = createTRPCRouter({
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  categories: categoriesRouter,
  playLists: playListsRouter,
  search: searchRouter,
  studio: studioRouter,
  subscriptions: subscriptionsRouter,
  suggestions: suggestionsRouter,
  users: userRouter,
  videos: videosRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
