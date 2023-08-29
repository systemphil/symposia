// Wrapper for the MDXEditor with correct types so that it can properly be dynamically imported.

import React from 'react';
import { MDXEditor, MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';

interface WrappedEditorProps extends MDXEditorProps {
    editorRef: React.ForwardedRef<MDXEditorMethods>;
}
const WrappedEditor: React.FC<WrappedEditorProps> = ({ editorRef, ...props }) => {
    return <MDXEditor {...props} ref={editorRef} />;
}

export default WrappedEditor;