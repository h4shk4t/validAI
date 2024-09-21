import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ActiveFilesHeader from "./active-files-header";
import { Editor, Monaco } from "@monaco-editor/react";
import { useEffect } from "react";
import darcula from "./darcula.json";
import SecondaryPanel from "./secondary-panel";
import { getFileContent, saveFile } from "@/lib/api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { getSuggestions } from "@/lib/autocomplete";

const CodeEditor = () => {
  const theme = JSON.parse(JSON.stringify(darcula));
  const { selectedFile, currentFileContent, setCurrentFileContent } = useCodespaceStore();

  const debouncedFileContent = useDebounce(currentFileContent, 500);
  useEffect(() => {
    async function saveContent() {
      if (debouncedFileContent && selectedFile) {
        await saveFile(selectedFile.path, debouncedFileContent); 
      }
    }
    saveContent();
  }, [debouncedFileContent]);

  useEffect(() => {
    async function fetchContent() {
      const content = selectedFile
        ? await getFileContent(selectedFile.path)
        : "";
      setCurrentFileContent(content);
    }
    fetchContent();
  }, [selectedFile]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.editor.setTheme("darcula");

    monaco.languages.register({ id: 'solidity' });
    monaco.editor.setModelLanguage(editor.getModel(), 'solidity');

    monaco.languages.registerCompletionItemProvider('solidity', {
      triggerCharacters: ['.', ' '], 
      provideCompletionItems: async (model: any, position: any) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const fileContent = model.getValue();
        
        console.log('Current Solidity line:', lineContent);

        try {
          console.log('Fetching Solidity suggestions');
          const suggestions = await getSuggestions(lineContent, fileContent);

          const formattedSuggestions = suggestions.map((suggestion) => ({
            label: suggestion,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: suggestion,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: 1,
              endColumn: position.column,
            },
          }));
          console.log('Formatted Solidity suggestions:', formattedSuggestions);

          return { suggestions: formattedSuggestions };
        } catch (error) {
          console.error('Error in Solidity completion provider:', error);
          return { suggestions: [] };
        }
      },
    });

    editor.updateOptions({
      suggestFontSize: 14,
      suggestLineHeight: 22,
      suggest: {
        preview: true,
        showIcons: true,
        maxVisibleSuggestions: 8,
        insertMode: 'insert',
        snippetsPreventQuickSuggestions: false,
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      parameterHints: {
        enabled: true
      },
    });

    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .suggest-widget {
        opacity: 0.95 !important;
        background-color: #2B2B2B !important;
        border: 1px solid #3C3F41 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      }
      .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label {
        color: #A9B7C6 !important;
      }
      .suggest-widget .monaco-list .monaco-list-row.focused {
        background-color: #4B6EAF !important;
      }
    `;
    document.head.appendChild(styleElement);
  };

  return (
    <ResizablePanelGroup direction="vertical" className="w-full border-b">
      <ResizablePanel defaultSize={70}>
        <ActiveFilesHeader setFileContent={setCurrentFileContent} />
        <Editor
          value={currentFileContent}
          language="solidity"
          width={"100%"}
          height={"100%"}
          onChange={(fileContent) => setCurrentFileContent(fileContent)}
          theme="darcula"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("darcula", theme);
          }}
          onMount={handleEditorDidMount}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <SecondaryPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CodeEditor;