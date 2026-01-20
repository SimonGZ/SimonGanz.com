import { toString } from 'mdast-util-to-string';
import { toHtml } from 'hast-util-to-html';
import { toHast } from 'mdast-util-to-hast';

export function remarkExcerpt() {
  return function (tree, file) {
    const children = tree.children;
    let excerptIndex = -1;

    // Find the comment node "more"
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        // Check for HTML comment or MDX Flow Expression (JSX comment)
        if ((node.type === 'html' && node.value.trim() === '<!-- more -->') ||
            (node.type === 'mdxFlowExpression' && node.value.trim() === '/* more */')) {
            excerptIndex = i;
            break;
        }
    }

    if (excerptIndex !== -1) {
        // We found a separator
        const excerptNodes = children.slice(0, excerptIndex);
        
        // Convert these nodes to HTML
        // We need a root node to convert
        const root = {
            type: 'root',
            children: excerptNodes
        };
        
        const hast = toHast(root);
        const html = toHtml(hast);
        
        file.data.astro.frontmatter.excerpt = html;
    }
  };
}
