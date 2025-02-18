type ModelSelectorProps = {
  ollamaStatus: 'running' | 'not-running' | 'no-models';
  models: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
};

export const ModelSelector = ({ ollamaStatus, models, selectedModel, setSelectedModel }: ModelSelectorProps) => {
  if (ollamaStatus === 'running' && models.length > 0) {
    return (
      <div className="absolute bottom-0 right-0">
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return null;
};