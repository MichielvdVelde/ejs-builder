import { createRenderer } from "../src/renderer";

test("render", async () => {
  const templateString = "Hello, <%= name %>!";
  const render = createRenderer(templateString);
  const result = await render({ name: "world" });
  expect(result).toBe("Hello, world!");
});
