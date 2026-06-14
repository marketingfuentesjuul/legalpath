import React from 'react';

export function DocumentViewer({ documents }) {
  if (!documents?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <span className="material-symbols-outlined text-gray-300 text-3xl mb-1">folder_open</span>
        <p className="text-gray-400 text-sm">Sin documentos adjuntos</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {documents.map(doc => (
        <li key={doc.id} className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-xl transition-all duration-200">
          <div className="flex items-center gap-3 truncate mr-4">
            <div className="w-9 h-9 rounded-lg bg-gray-200/60 flex items-center justify-center flex-shrink-0 text-gray-500">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-gray-700 truncate" title={doc.file_name}>
                {doc.file_name}
              </p>
              {doc.file_type && (
                <p className="text-[11px] text-gray-400 font-mono">
                  {doc.file_type.split('/').pop().toUpperCase()}
                </p>
              )}
            </div>
          </div>
          <a
            href={doc.storage_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            Ver / Descargar
          </a>
        </li>
      ))}
    </ul>
  );
}
