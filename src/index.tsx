import * as React from 'react';

import * as wmd from 'writers-mark-dom';
import { Context, Style, Options } from 'writers-mark';

const WritersMarkContext = React.createContext<Context>(new Context());
const WritersMarkStylingContext = React.createContext<Style[]>([]);

///////////////////////////
interface ContextProviderProps {
  options: Options;
}

export const ContextProvider: React.FC<ContextProviderProps> = (props) => {
  const ctx = new Context(props.options);
  return <WritersMarkContext.Provider value={ctx}>{props.children}</WritersMarkContext.Provider>;
};

///////////////////////////
interface StyleProviderProps {
  text: string;
}

export const StyleProvider: React.FC<StyleProviderProps> = (props) => {
  const ctx = React.useContext(WritersMarkContext);
  const parentStyles = React.useContext(WritersMarkStylingContext);

  const styles = [...parentStyles, ctx.compileStyle(props.text)];
  return <WritersMarkStylingContext.Provider value={styles}>{props.children}</WritersMarkStylingContext.Provider>;
};

///////////////////////////
interface WritersMarkProps {
  text: string;
}

/** Does a simple one-shot rendering. */
export const WritersMark: React.FC<WritersMarkProps> = (props) => {
  const ctx = React.useContext(WritersMarkContext);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const styles = React.useContext(WritersMarkStylingContext);

  React.useEffect(() => {
    const text = ctx.compileText(props.text, styles);
    const cleanup = wmd.render(text, containerRef.current!);
    return () => {
      cleanup();
      containerRef.current!.innerHTML = '';
      containerRef.current!.className = '';
    };
  }, [props.text, styles]);

  return <div ref={containerRef}></div>;
};
