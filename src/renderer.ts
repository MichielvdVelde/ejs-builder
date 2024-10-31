import { composeMiddleware } from "./middleware";
import type { ComposeFn, Context, Middleware, Render } from "./types";
import {
  type AsyncTemplateFunction,
  compile,
  type Data,
  type Options,
} from "ejs";

/**
 * Creates a renderer that renders a template with a view.
 * @param template The template to render.
 * @param options The options for compiling the template.
 * @returns The renderer.
 */
export function createRenderer<View>(
  template: string,
  options?: Omit<Options, "async">,
): Render<View> {
  const middlewares: Middleware<View>[] = [];

  // Compile the template with the options.
  const compiled = compile(template, {
    ...options,
    async: true,
  }) as AsyncTemplateFunction;

  // The compose function that renders the view with the compiled template.
  const composeFn: ComposeFn<View> = async (ctx) => {
    ctx.content = await compiled(ctx.view as Data);
  };

  const renderer: Render<View> = async (view) => {
    const renderFn = composeMiddleware(composeFn, ...middlewares);
    const ctx: Context<View> = { view };

    await renderFn(ctx);

    if (!ctx.content) {
      throw new Error("Content not rendered");
    }

    return ctx.content;
  };

  renderer.use = (...middlewares: Middleware<View>[]) => {
    middlewares.push(...middlewares);
    return renderer;
  };

  return renderer;
}
