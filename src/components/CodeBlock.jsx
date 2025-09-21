import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeBlock = ({ language, value }) => {
	return (
		<SyntaxHighlighter
			language={language || 'javascript'}
			style={vscDarkPlus} // ← стиль как в VS Code
			customStyle={{
				borderRadius: '8px',
				margin: '16px 0',
				fontSize: '14px',
			}}
			showLineNumbers
		>
			{value}
		</SyntaxHighlighter>
	);
};
