# EJS Renderer

A wrapper around the [EJS](https://ejs.co/) library to render templates with
middleware.

## Installation

```sh
npm install ejs-builder
```

## Usage

The following example demonstrates how to create a renderer with a template
string and use middleware to modify the view before rendering.

```ts
import { createRenderer } from "ejs-builder";

// Define a view interface
interface View {
  name: string;
}

// Get a template string from somewhere
const templateStr = "<h1>Hello, <%= name %>!</h1>";

// Create a renderer with a template string
const render = createRenderer<View>(templateStr);

// Use a middleware to modify the view
render.use(async (ctx, next) => {
  ctx.view.name = ctx.view.name.toUpperCase();
  await next();
});

render.use(async (ctx, next) => {
  ctx.view.name = ctx.view.name.replace("!", "!!");
  await next();
});

// Render the template with a view
const html = await render({ name: "world" });
console.log(html); // <h1>Hello, WORLD!!</h1>
```

## API

### Renderer

The renderer class is used to render templates with middleware.

#### `createRenderer<T>(template: string, options?: Options): Render<T>`

Creates a new renderer with the given template string.

Arguments:

- `template` - The template string to render
- `options` - The options to pass to the EJS compiler

Example:

```ts
import { createRenderer } from "ejs-builder";

const templateString = "<h1>Hello, <%= name %>!</h1>";
const renderer = createRenderer(templateString, { delimiter: "?" });
```

#### `render(view: T): Promise<string>`

Renders the template with the given view.

Arguments:

- `view` - The view to render the template with

#### `render.use(...middlewares: Middleware<T>[]): void`

Adds a middleware to the renderer.

Arguments:

- `middlewares` - The middleware functions to add

### Middleware

#### `composeMiddleware<T>(fn: ComposeFn<T>, ...middlewares: Middleware<T>[]): ComposedFn<T>`

Composes a middleware function with the given compile function and middleware.

Arguments:

- `fn` - The compose function
- `middlewares` - The middleware functions

Example:

```ts
import { composeMiddleware } from "ejs-builder";

const middleware = composeMiddleware(
  (ctx, next) => {
    ctx.view.name = ctx.view.name.toUpperCase();
    return next();
  },
  (ctx, next) => {
    ctx.view.name = ctx.view.name.replace("!", "!!");
    return next();
  },
);

// Execute the middleware
await middleware({ view: { name: "world" } });
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
