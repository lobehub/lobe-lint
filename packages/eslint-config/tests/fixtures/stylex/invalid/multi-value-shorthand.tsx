import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  root: {
    padding: '4px 8px',
  },
});

export const Root = () => <div {...stylex.props(styles.root)} />;
