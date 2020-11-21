import * as React from 'react';
import * as wm from 'writers-mark';
import { createStyleElement } from 'writers-mark-dom';

import { Block, SpanSection, splitParagraphs, compileParagraph } from 'writers-mark/lib/ast';

interface WritersMarkProps {
  ast: wm.AST;
  style: wm.Style;
}

export const WritersMark: React.FC<WritersMarkProps> = (props) => {
  const [rules, setRules] = React.useState<Record<string, string>>();

  const render = (what: string | SpanSection, key: number) => {
    const asSpanSection = what as SpanSection;
    if (asSpanSection.contents && asSpanSection.style) {
      let className = '';
      if (rules) {
        className = rules['s_' + asSpanSection.style];
      }
      return (
        <span key={key} className={className}>
          {asSpanSection.contents.map(render)}
        </span>
      );
    } else {
      return what as string;
    }
  };

  // Slap one the stylesheet
  React.useEffect(() => {
    const [sheet, newRules] = createStyleElement(props.style);
    setRules(newRules);

    return () => {
      document.head.removeChild(sheet);
    };
  }, [props.style]);

  return (
    <>
      {props.ast.paragraphs.map((p, i) => {
        let classes: string[] = [];
        if (rules && p.styles) {
          classes = p.styles.map((s) => rules['p_' + s]);
        }

        return (
          <p key={i} className={classes.join(' ')}>
            {p.contents.map(render)}
          </p>
        );
      })}
    </>
  );
};

interface WritersMarkRawProps {
  content: string;
  style: string;
  options?: wm.Options;
  debounce?: number;
}

export const WritersMarkRaw: React.FC<WritersMarkRawProps> = (props) => {
  // Perform a two-stage compilation. This way paragraphs that do not change do not need to be recompiled.
  const paragraphs = React.useMemo(() => splitParagraphs(props.content), [props.content]);
  const style = React.useMemo(() => wm.compileStyle(props.style, props.options), [props.style, props.options]);

  const ast: wm.AST = { paragraphs: [] };

  for (const p of paragraphs) {
    ast.paragraphs.push(React.useMemo(() => compileParagraph(p, style), [p, style]));
  }

  return <WritersMark ast={ast} style={style} />;
};
