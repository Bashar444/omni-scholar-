export interface AppState {
  ui: {
    initialized: boolean;
    loading: boolean;
  };
}

export const initialAppState: AppState = {
  ui: {
    initialized: false,
    loading: false,
  },
};
