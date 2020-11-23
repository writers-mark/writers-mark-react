import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { WritersMark, StyleProvider, ContextProvider } from './index';
import '@testing-library/jest-dom';

test('renders simple paragraph', () => {
  render(<WritersMark text="hello" />);
  const pElement = screen.getByText(/hello/i);
  expect(pElement).toBeInTheDocument();
  expect(pElement).toBeInstanceOf(HTMLParagraphElement);
});

test('renders styled paragraph', () => {
  const content = 'yo\nhello';
  render(
    <StyleProvider text="para yo {color: red;}">
      <WritersMark text={content} />
    </StyleProvider>,
  );
  const pElement = screen.getByText(/hello/i);

  expect(pElement).toBeInTheDocument();
  expect(pElement).toBeInstanceOf(HTMLParagraphElement);
  expect(getComputedStyle(pElement)).toHaveProperty('color', 'red');
});

test('renders dual styled paragraph', () => {
  const content = 'yo\nsup\nhello';
  render(
    <StyleProvider text="para yo {color: red;}">
      <StyleProvider text="para sup {margin: 12px;}">
        <WritersMark text={content} />
      </StyleProvider>
    </StyleProvider>,
  );

  const pElement = screen.getByText(/hello/i);

  expect(pElement).toBeInTheDocument();
  expect(pElement).toBeInstanceOf(HTMLParagraphElement);
  expect(getComputedStyle(pElement)).toHaveProperty('color', 'red');
  expect(getComputedStyle(pElement)).toHaveProperty('margin', '12px');
});

test('renders simple span', () => {
  render(
    <StyleProvider text="span * {color: red;}">
      <WritersMark text="hello *world*" />
    </StyleProvider>,
  );

  const helloElem = screen.getByText(/hello/i);
  expect(helloElem).toBeInTheDocument();
  expect(helloElem).toBeInstanceOf(HTMLParagraphElement);

  const worldElem = screen.getByText(/world/i);
  expect(worldElem).toBeInTheDocument();
  expect(worldElem).toBeInstanceOf(HTMLSpanElement);
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
        <WritersMark text="Hello *World*" />
      </StyleProvider>
    </ContextProvider>,
  );

  const helloElem = screen.getByText(/hello/i);
  expect(helloElem).toBeInTheDocument();
  expect(helloElem).toBeInstanceOf(HTMLParagraphElement);

  const worldElem = screen.getByText(/world/i);
  expect(worldElem).toBeInTheDocument();
  expect(worldElem).toBeInstanceOf(HTMLSpanElement);
  expect(getComputedStyle(worldElem)).toHaveProperty('color', 'red');
  expect(getComputedStyle(worldElem)).not.toHaveProperty('font-weight', 'bold');
});
