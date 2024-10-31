/**
 * The context object that is passed to the middleware functions.
 */
export interface Context<View> {
  /** The view object that contains the data to be rendered in the template. */
  view: View;
  /** The rendered content. */
  content?: string;
}

/** The next function that is called to execute the next middleware function. */
export type Next = () => Promise<void>;

/** A middleware function that can modify the view before rendering the template. */
export type Middleware<View> = (
  ctx: Context<View>,
  next: Next,
) => Promise<void>;

/** A function that composes the template with the view. */
export type ComposeFn<View> = (ctx: Context<View>) => Promise<void>;

/**
 * A renderer that renders a template with a view.
 */
export interface Render<View> {
  /**
   * Renders the template with the view.
   * @param view The view object that contains the data to be rendered in the template.
   */
  (view: View): Promise<string>;
  /**
   * Adds middleware functions to the renderer.
   * @param middlewares The middleware functions to add.
   */
  use(...middlewares: Middleware<View>[]): Render<View>;
}
