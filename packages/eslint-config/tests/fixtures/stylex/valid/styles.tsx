import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  root: {
    color: 'red',
    paddingBlock: 4,
    paddingInline: 8,
  },
});

export const Root = () => <div {...stylex.props(styles.root)} />;
