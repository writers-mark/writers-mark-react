import * as React from 'react';
import * as wm from 'writers-mark';
import { createStyleElement } from 'writers-mark-dom';
import { defaultParagraphRule } from 'writers-mark/lib/options';
import { SpanSection, splitParagraphs, compileParagraph } from 'writers-mark/lib/ast';

interface WritersMarkSectionProps {
  content: string | SpanSection;
  rules?: Record<string, string>;
}

const WritersMarkSection: React.FC<WritersMarkSectionProps> = (props) => {
  const asSection = props.content as SpanSection;
  if (asSection.contents && asSection.style) {
    let className = '';
    if (props.rules) {
      className = props.rules['s_' + asSection.style];
    }

    return (
      <span className={className}>
        {asSection.contents.map((s, i) => (
          <WritersMarkSection key={i} content={s} rules={props.rules} />
        ))}
      </span>
    );
  } else {
    return <>{props.content as string}</>;
  }
};

interface WritersMarkParagraphProps {
  content: string[];
  style: wm.Style;
  rules?: Record<string, string>;
  options?: wm.Options;
}

const WritersMarkParagraph: React.FC<WritersMarkParagraphProps> = (props) => {
  const p = React.useMemo(() => compileParagraph(props.content, props.style), [props.style, props.content]);

  let classes: string[] = [];
  if (props.rules && p.styles) {
    classes = p.styles.map((s) => props.rules!['p_' + s]);
  } else if (props.rules) {
    const defaultP = props.options ? props.options.defaultPRule : defaultParagraphRule;
    classes = [props.rules['p_' + defaultP]];
  }

  return (
    <p className={classes.join(' ')}>
      {p.contents.map((s, i) => (
        <WritersMarkSection key={i} content={s} rules={props.rules} />
      ))}
    </p>
  );
};

interface WritersMarkRuleInjectorProps {
  style: wm.Style;
  onRulesChanged: (cb: Record<string, string>) => void;
}

const WritersMarkRuleInjector: React.FC<WritersMarkRuleInjectorProps> = (props) => {
  React.useEffect(() => {
    const [sheet, newRules] = createStyleElement(props.style);
    props.onRulesChanged(newRules);

    return () => {
      document.head.removeChild(sheet);
    };
  }, [props.style]);

  return <></>;
};

interface WritersMarkProps {
  content: string;
  style: string;
  options?: wm.Options;
}

export const WritersMark: React.FC<WritersMarkProps> = (props) => {
  const [rules, setRules] = React.useState<Record<string, string>>();

  // Perform a two-stage compilation. This way paragraphs that do not change do not need to be recompiled.
  const paragraphs = React.useMemo(() => [...splitParagraphs(props.content)], [props.content]);
  const style = React.useMemo(() => wm.compileStyle(props.style, props.options), [props.style, props.options]);

  const ast: wm.AST = { paragraphs: paragraphs.map((p) => compileParagraph(p, style)) };

  for (const p of paragraphs) {
    ast.paragraphs.push(compileParagraph(p, style));
  }

  return (
    <>
      <WritersMarkRuleInjector style={style} onRulesChanged={setRules} />
      {paragraphs.map((p, i) => (
        <WritersMarkParagraph key={i} content={p} style={style} rules={rules} />
      ))}
    </>
  );
};
