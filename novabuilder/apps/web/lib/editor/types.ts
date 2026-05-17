export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'button'
  | 'columns'
  | 'spacer'
  | 'card'
  | 'navigation'
  | 'footer'
  | 'form'
  | 'video';

export type BlockProps = Record<string, unknown>;

export type Block = {
  id: string;
  type: BlockType;
  props: BlockProps;
  children?: Block[];
};

export type BlockDefinition = {
  type: BlockType;
  label: string;
  icon: string;
  category: 'layout' | 'content' | 'media' | 'interactive';
  defaultProps: BlockProps;
};

export type EditorState = {
  blocks: Block[];
  selectedBlockId: string | null;
  isDragging: boolean;
  dragOverIndex: number | null;
};

export type EditorAction =
  | { type: 'ADD_BLOCK'; block: Block; index?: number }
  | { type: 'REMOVE_BLOCK'; id: string }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number }
  | { type: 'UPDATE_BLOCK_PROPS'; id: string; props: Partial<BlockProps> }
  | { type: 'SELECT_BLOCK'; id: string | null }
  | { type: 'SET_DRAGGING'; isDragging: boolean }
  | { type: 'SET_DRAG_OVER'; index: number | null }
  | { type: 'SET_BLOCKS'; blocks: Block[] }
  | { type: 'DUPLICATE_BLOCK'; id: string }
  | { type: 'ADD_CHILD_BLOCK'; parentId: string; columnIndex: number; block: Block }
  | { type: 'REMOVE_CHILD_BLOCK'; parentId: string; childId: string };
