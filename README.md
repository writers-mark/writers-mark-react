# Writer's Mark React Renderer

This is a React component for [writers-mark](https://github.com/writers-mark/writers-mark).

## Installation

`npm install writers-mark-react`

## Usage

### Rendering content

The `WritersMark` will simply render the passed text as is.

```
import {WritersMark} from 'writers-mark-react';

export const MyComponent = () {
  return <WritersMark text="Hello World"/>
} 
```

### Applying styles

`<StyleProvider>` will apply the provided style to all its children.

```
import {WritersMark, StyleProvider} from 'writers-mark-react';

export const MyComponent = () {
  return (
    <StyleProvider text="span * {font-weight: bold;}">
      <WritersMark text="Hello *World*"/>
    </StyleProvider>
    )
} 
```

N.B. Nothing stops you from having multiple `<StyleProvider>` in the same hierarchy.

### Custom context

If you want to specify the CSS whitelist, you can use `<ContextProvider>`:

`<StyleProvider>` will apply the provided style to all its children.

```
import {WritersMark, StyleProvider, ContextProvider} from 'writers-mark-react';

export const MyComponent = () {
  const options = { 
    whitelist: {
      para: ['text-align', 'margin', 'margin-left'],
      span: ['font-weight'],
      cont: [],
    }
  };

  return (
    <ContextProvider options={options}>
      <StyleProvider text="span * {font-weight: bold;}">
        <WritersMark text="Hello *World*"/>
      </StyleProvider>
    </ContextProvider>
    )
} 
```