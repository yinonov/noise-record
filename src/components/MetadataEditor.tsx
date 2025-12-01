
import { useState } from 'react';
import type { EvidenceData, Category, RecordItem } from '../utils/dataLoader';
import './MetadataEditor.css';

interface MetadataEditorProps {
  data: EvidenceData;
  onSave: (newData: EvidenceData) => void;
  onCancel: () => void;
}

export function MetadataEditor({ data, onSave, onCancel }: MetadataEditorProps) {
  const [editedData, setEditedData] = useState<EvidenceData>(data);

  const handleCategoryChange = (catIndex: number, field: keyof Category, value: string) => {
    const newCategories = [...editedData.categories];
    newCategories[catIndex] = { ...newCategories[catIndex], [field]: value };
    setEditedData({ ...editedData, categories: newCategories });
  };

  const handleRecordChange = (catIndex: number, recIndex: number, field: keyof RecordItem, value: string) => {
    const newCategories = [...editedData.categories];
    const newRecords = [...newCategories[catIndex].records];
    newRecords[recIndex] = { ...newRecords[recIndex], [field]: value };
    newCategories[catIndex] = { ...newCategories[catIndex], records: newRecords };
    setEditedData({ ...editedData, categories: newCategories });
  };

  const handleDownload = () => {
    const jsonString = JSON.stringify(editedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evidence.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onSave(editedData);
  };

  return (
    <div className="metadata-editor">
      <div className="editor-header">
        <h2>Edit Metadata</h2>
        <div className="actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="primary" onClick={handleDownload}>Download JSON</button>
        </div>
      </div>
      
      <div className="editor-content">
        {editedData.categories.map((category, catIndex) => (
          <div key={category.id} className="editor-category">
            <input
              className="category-title-input"
              value={category.title}
              onChange={(e) => handleCategoryChange(catIndex, 'title', e.target.value)}
              placeholder="Category Title"
            />
            
            <div className="editor-records">
              {category.records.map((record, recIndex) => (
                <div key={record.id} className="editor-record">
                  <div className="record-inputs">
                    <input
                      className="record-date-input"
                      type="date"
                      value={record.occurredAt}
                      onChange={(e) => handleRecordChange(catIndex, recIndex, 'occurredAt', e.target.value)}
                    />
                    <input
                      className="record-title-input"
                      value={record.title}
                      onChange={(e) => handleRecordChange(catIndex, recIndex, 'title', e.target.value)}
                      placeholder="Record Title"
                    />
                  </div>
                  <div className="record-media-count">
                    {record.media.length} items
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
