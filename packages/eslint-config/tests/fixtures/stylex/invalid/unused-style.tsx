import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  root: {
    color: 'red',
  },
  unused: {
    color: 'blue',
  },
});

export const Root = () => <div {...stylex.props(styles.root)} />;
