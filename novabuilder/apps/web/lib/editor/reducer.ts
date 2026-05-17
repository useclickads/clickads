import type { EditorState, EditorAction } from './types';

export const initialEditorState: EditorState = {
  blocks: [],
  selectedBlockId: null,
  isDragging: false,
  dragOverIndex: null,
};

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const blocks = [...state.blocks];
      const index = action.index ?? blocks.length;
      blocks.splice(index, 0, action.block);
      return { ...state, blocks, selectedBlockId: action.block.id };
    }
    case 'REMOVE_BLOCK': {
      const blocks = state.blocks.filter((b) => b.id !== action.id);
      const selectedBlockId = state.selectedBlockId === action.id ? null : state.selectedBlockId;
      return { ...state, blocks, selectedBlockId };
    }
    case 'MOVE_BLOCK': {
      const blocks = [...state.blocks];
      const [moved] = blocks.splice(action.fromIndex, 1);
      blocks.splice(action.toIndex, 0, moved);
      return { ...state, blocks };
    }
    case 'UPDATE_BLOCK_PROPS': {
      const blocks = state.blocks.map((b) =>
        b.id === action.id ? { ...b, props: { ...b.props, ...action.props } } : b
      );
      return { ...state, blocks };
    }
    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.id };
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.isDragging };
    case 'SET_DRAG_OVER':
      return { ...state, dragOverIndex: action.index };
    case 'SET_BLOCKS':
      return { ...state, blocks: action.blocks, selectedBlockId: null };
    case 'DUPLICATE_BLOCK': {
      const idx = state.blocks.findIndex((b) => b.id === action.id);
      if (idx === -1) return state;
      const original = state.blocks[idx];
      const copy = { ...original, id: generateId(), props: { ...original.props } };
      const blocks = [...state.blocks];
      blocks.splice(idx + 1, 0, copy);
      return { ...state, blocks, selectedBlockId: copy.id };
    }
    default:
      return state;
  }
}

function generateId() {
  return `block_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export { generateId };
