export interface EditorCoreConfig {
  containerId: string;
}
export const initializeEditor = (_config: EditorCoreConfig) => {
  return {
    ready: true
  };
};
