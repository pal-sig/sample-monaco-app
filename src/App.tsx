import * as monaco from "monaco-editor";
import { useRef, useEffect, useCallback, useState } from "react";

function App() {
  const divEl = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const value = useRef(`groups:
- name: ExampleCPULoadGroup
  rules:
  - alert: HighCpuLoad
    expr: system_cpu_load_average_1m > 0.1
    for: 0m
    labels:
      severity: warning
    annotations:
      summary: High CPU load
      description: "CPU load is > 0.1\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"`);

  useEffect(() => {
    let editor = editorRef.current;

    if (divEl.current) {
      editor = monaco.editor.create(divEl.current, {
        value: value.current,
        useShadowDOM: true,
        minimap: {
          enabled: false,
        },
        language: "yaml",
      });
    }

    editor?.getModel()?.onDidChangeContent(() => {
      value.current = editor?.getValue() || "";
    });
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [value]);

  const onSaveHandler = useCallback(() => {
    console.log(value.current);
  }, [value]);

  return (
    <>
      <div style={{ minHeight: "50vh" }} ref={divEl}></div>

      <button onClick={onSaveHandler}>Save</button>
    </>
  );
}

export default App;
