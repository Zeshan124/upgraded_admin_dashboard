import React, { useEffect, useRef } from "react";
import ErrorBoundary from "~/components/utils/ErrorBoundary";

function Editor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
  }, []);
  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "outdent",
      "indent",
      "|",
      "imageUpload",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "alignment",
      "|",
      "undo",
      "redo",
    ],
    styles: {
      height: "500px",
    },
    content: "ar",
    contentStyle:
      'body { direction: rtl; unicode-bidi: embed; font-family: "Noto Nastaliq Urdu", serif; }',
    language: "ur",
  };
  return (
    <div>
      <ErrorBoundary>
        {editorLoaded ? (
          <CKEditor
            name={name}
            // type=""
            editor={ClassicEditor}
            data={value}
            onChange={onChange}
            config={editorConfiguration}
          />
        ) : (
          <div>Editor loading</div>
        )}
      </ErrorBoundary>
    </div>
  );
}

export default Editor;
