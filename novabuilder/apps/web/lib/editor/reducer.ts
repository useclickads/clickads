import type { Block, EditorState, EditorAction } from './types';

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
      const blocks = removeBlockDeep(state.blocks, action.id);
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
      const blocks = updateBlockDeep(state.blocks, action.id, (b) => ({
        ...b,
        props: { ...b.props, ...action.props },
      }));
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
      const copy = deepCloneBlock(original);
      const blocks = [...state.blocks];
      blocks.splice(idx + 1, 0, copy);
      return { ...state, blocks, selectedBlockId: copy.id };
    }
    case 'ADD_CHILD_BLOCK': {
      const blocks = updateBlockDeep(state.blocks, action.parentId, (b) => {
        const children = [...(b.children || [])];
        children.push(action.block);
        return { ...b, children };
      });
      return { ...state, blocks, selectedBlockId: action.block.id };
    }
    case 'REMOVE_CHILD_BLOCK': {
      const blocks = updateBlockDeep(state.blocks, action.parentId, (b) => {
        const children = (b.children || []).filter((c) => c.id !== action.childId);
        return { ...b, children };
      });
      const selectedBlockId = state.selectedBlockId === action.childId ? null : state.selectedBlockId;
      return { ...state, blocks, selectedBlockId };
    }
    default:
      return state;
  }
}

function removeBlockDeep(blocks: Block[], id: string): Block[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => (b.children ? { ...b, children: removeBlockDeep(b.children, id) } : b));
}

function updateBlockDeep(blocks: Block[], id: string, updater: (b: Block) => Block): Block[] {
  return blocks.map((b) => {
    if (b.id === id) return updater(b);
    if (b.children) return { ...b, children: updateBlockDeep(b.children, id, updater) };
    return b;
  });
}

function deepCloneBlock(block: Block): Block {
  return {
    ...block,
    id: generateId(),
    props: { ...block.props },
    children: block.children?.map(deepCloneBlock),
  };
}

function generateId() {
  return `block_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export { generateId };

export function findBlockById(blocks: Block[], id: string): Block | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children) {
      const found = findBlockById(b.children, id);
      if (found) return found;
    }
  }
  return null;
}
