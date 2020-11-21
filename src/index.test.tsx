import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { WritersMarkRaw } from './index';
import '@testing-library/jest-dom';

test('renders simple paragraph', () => {
  render(<WritersMarkRaw content="hello" style="" />);
  const pElement = screen.getByText(/hello/i);
  expect(pElement).toBeInTheDocument();
  expect(pElement).toBeInstanceOf(HTMLParagraphElement);
});

test('renders styled paragraph', () => {
  const content = 'yo\nhello';
  render(<WritersMarkRaw content={content} style="p yo {color: red;}" />);
  const pElement = screen.getByText(/hello/i);

  expect(pElement).toBeInTheDocument();
  expect(pElement).toBeInstanceOf(HTMLParagraphElement);
  expect(getComputedStyle(pElement)).toHaveProperty('color', 'red');
});

test('renders dual styled paragraph', () => {
  const content = 'yo\nsup\nhello';
  render(<WritersMarkRaw content={content} style="p yo {color: red;} p sup {margin-left: 12px;}" />);
  const pElement = screen.getByText(/hello/i);

  expect(pElement).toBeInTheDocument();
  expect(pElement).toBeInstanceOf(HTMLParagraphElement);
  expect(getComputedStyle(pElement)).toHaveProperty('color', 'red');
  expect(getComputedStyle(pElement)).toHaveProperty('margin-left', '12px');
});

test('renders simple span', () => {
  render(<WritersMarkRaw content="hello *world*" style="s * {color: red;}" />);

  const helloElem = screen.getByText(/hello/i);
  expect(helloElem).toBeInTheDocument();
  expect(helloElem).toBeInstanceOf(HTMLParagraphElement);

  const worldElem = screen.getByText(/world/i);
  expect(worldElem).toBeInTheDocument();
  expect(worldElem).toBeInstanceOf(HTMLSpanElement);
  expect(getComputedStyle(worldElem)).toHaveProperty('color', 'red');
});
