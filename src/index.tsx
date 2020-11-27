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
  title?: string;
  className?: string;
}

/** Does a simple one-shot rendering. */
export const WritersMark: React.FC<WritersMarkProps> = (props) => {
  const ctx = React.useContext(WritersMarkContext);
  const containerRef = React.useRef<HTMLIFrameElement>(null);
  const styles = React.useContext(WritersMarkStylingContext);

  React.useEffect(() => {
    const text = ctx.compileText(props.text, styles);
    const { styleElement } = wmd.dangerousRender(text, containerRef.current!.contentDocument!.body);

    return () => {
      if (containerRef.current?.contentDocument) {
        containerRef.current!.contentDocument!.head.removeChild(styleElement);
        containerRef.current!.contentDocument!.body!.innerHTML = '';
      }
    };
  }, [props.text, styles]);

  return (
    <iframe
      className={props.className}
      ref={containerRef}
      title={props.title}
      frameBorder={0}
      sandbox={'allow-same-origin'}
    ></iframe>
  );
};
