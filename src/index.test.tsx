import * as React from 'react';
import { render, screen,getByText } from '@testing-library/react';
import { WritersMark, StyleProvider, ContextProvider } from './index';
import '@testing-library/jest-dom';

test('renders simple paragraph', () => {
  render(<WritersMark title={"test"} text="hello"/>);
  const body = (screen.getByTitle("test") as HTMLIFrameElement).contentDocument!.body;

  const pElement = getByText(body, /hello/i);
  expect(pElement).toBeInTheDocument();
});


test('renders styled paragraph', () => {
  const content = 'yo\nhello';
  render(
    <StyleProvider text="para yo {color: red;}">
      <WritersMark title={"test"} text={content} />
    </StyleProvider>,
  );
  const body = (screen.getByTitle("test") as HTMLIFrameElement).contentDocument!.body;

  const pElement = getByText(body, /hello/i);

  expect(pElement).toBeInTheDocument();
  expect(getComputedStyle(pElement)).toHaveProperty('color', 'red');
});

test('renders dual styled paragraph', () => {
  const content = 'yo\nsup\nhello';
  render(
    <StyleProvider text="para yo {color: red;}">
      <StyleProvider text="para sup {margin: 12px;}">
        <WritersMark title={"test"} text={content} />
      </StyleProvider>
    </StyleProvider>,
  );
  const body = (screen.getByTitle("test") as HTMLIFrameElement).contentDocument!.body;

  const pElement = getByText(body, /hello/i);

  expect(pElement).toBeInTheDocument();
  expect(getComputedStyle(pElement)).toHaveProperty('color', 'red');
  expect(getComputedStyle(pElement)).toHaveProperty('margin', '12px');
});

test('renders simple span', () => {
  render(
    <StyleProvider text="span * {color: red;}">
      <WritersMark title={"test"} text="hello *world*" />
    </StyleProvider>,
  );
  const body = (screen.getByTitle("test") as HTMLIFrameElement).contentDocument!.body;

  const helloElem = getByText(body, /hello/i);
  expect(helloElem).toBeInTheDocument();
 
  const worldElem = getByText(body, /world/i);
  expect(worldElem).toBeInTheDocument();
  expect(getComputedStyle(worldElem)).toHaveProperty('color', 'red');
});

test('Custom whitelist', () => {
  const options = {
    whitelist: {
      para: [],
      span: ['color'],
      cont: [],
    },
  };

  render(
    <ContextProvider options={options}>
      <StyleProvider text="span * {font-weight: bold; color: red;}">
        <WritersMark title={"test"} text="Hello *World*" />
      </StyleProvider>
    </ContextProvider>,
  );
  const body = (screen.getByTitle("test") as HTMLIFrameElement).contentDocument!.body;

  const helloElem = getByText(body, /hello/i);
  expect(helloElem).toBeInTheDocument();

  const worldElem = getByText(body, /world/i);
  expect(worldElem).toBeInTheDocument();
  expect(getComputedStyle(worldElem)).toHaveProperty('color', 'red');
  expect(getComputedStyle(worldElem)).not.toHaveProperty('font-weight', 'bold');
});
