import { composeMiddleware } from "../src/middleware";
import type { ComposeFn, Context } from "../src/types";

test("middleware", async () => {
  interface View {
    name: string;
  }

  const print: ComposeFn<View> = async (ctx) => {
    ctx.content = `Hello, ${ctx.view.name}!`;
  };

  const middleware = composeMiddleware<View>(print, async (ctx, next) => {
    ctx.view.name = "world";
    await next();
  });

  const ctx: Context<View> = { view: { name: "world" } };
  await middleware(ctx);
  expect(ctx.view.name).toBe("world");
  expect(ctx.content).toBe("Hello, world!");
});
