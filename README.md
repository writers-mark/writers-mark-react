# Writer's Mark React Renderer

This is a React component for [writers-mark](https://github.com/writers-mark/writers-mark).

## When to use this module

[writers-mark-dom](https://github.com/writers-mark/writers-mark-dom) is small, correct, fast, and meant to be as safe as this react-based renderer. However, it is meant to be a one-and-done renderer, and any update to the style or content will require a complete re-render.

On the flip side, this React-based renderer is meant to handle partial rewrites and updates as efficiently as possible, at the cost of code size and performance. As such, a typical workflow would involve using this for authoring, and [writers-mark-dom](https://github.com/writers-mark/writers-mark-dom) for statically displaying content.

## Usage

You most likely will want to use `WritersMark`, which consumes content and styling as raw strings.

```
import {WritersMark} from 'writers-mark-react';

export const MyComponent = () {
  const text = 'Hello *World*';
  const format = 's * {font-weight: bold;}';

  return <WritersMark content={text} style={format}/>
} 
```
