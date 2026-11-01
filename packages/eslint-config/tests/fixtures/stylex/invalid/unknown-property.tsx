import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  root: {
    colr: 'red',
  },
});

export const Root = () => <div {...stylex.props(styles.root)} />;
