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
      visit(node.children[0], 'strong', (subnode: any) => {
        if (subnode.position.start.column !== 3) return;
        visit(subnode, 'text', (textnode: any) => {
          if (!['Note', 'Tip', 'Important', 'Warning', 'Caution'].includes(textnode.value)) return;
          for (const item of gfmHighlight) {
            if (item.from !== textnode.value) continue;
            subnode.type = 'text';
            subnode.value = item.to;
            return;
          }
        });
      });
    });
  };
}
