const gfmHighlight = [
  { from: 'Note', to: '[!NOTE]' },
  { from: 'Tip', to: '[!TIP]' },
  { from: 'Important', to: '[!IMPORTANT]' },
  { from: 'Warning', to: '[!WARNING]' },
  { from: 'Caution', to: '[!CAUTION]' },
];

export function remarkGfmHighlight() {
  return async (tree: any) => {
    const { visit } = await import('unist-util-visit');
    visit(tree, 'blockquote', (node: any) => {
      visit(node, 'strong', (subnode: any) => {
        let value = '';

        visit(subnode, 'text', (textnode: any) => {
          if (['Note', 'Tip', 'Important', 'Warning', 'Caution'].includes(textnode.value)) {
            for (const item of gfmHighlight) {
              if (item.from === textnode.value) {
                value = item.to;
              }
            }
          }
          if (value) {
            subnode.type = 'text';
            subnode.value = value;
          }
        });
      });
    });
  };
}
