import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = '500px'
}) => {
  const handleEditorChange = (newValue: string | undefined) => {
    if (typeof newValue === 'string') {
      onChange(newValue);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          folding: false,
          lineNumbers: 'on',
          tabSize: 2,
          automaticLayout: true,
        }}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
