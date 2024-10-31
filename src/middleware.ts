import type { ComposeFn, Middleware } from "./types";

/**
 * composes the middleware functions with the compose function.
 * @param fn The compose function.
 * @param middlewares The middleware functions.
 * @returns The composed compose function.
 */
export function composeMiddleware<View>(
  fn: ComposeFn<View>,
  ...middlewares: Middleware<View>[]
): ComposeFn<View> {
  return async (ctx) => {
    let index = -1;

    const next = async (i: number) => {
      if (i !== index) {
        throw new Error("next() called multiple times");
      }

      index++;

      if (index < middlewares.length) {
        try {
          await middlewares[index](ctx, () => next(index));
        } catch (error) {
          throw new AggregateError([error], "Error in middleware");
        }
      } else {
        try {
          await fn(ctx);
        } catch (error) {
          throw new AggregateError([error], "Error in compose function");
        }
      }
    };

    return next(index);
  };
}
