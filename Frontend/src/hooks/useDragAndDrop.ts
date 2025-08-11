import { useState } from "react";

interface DragAndDropHook<T> {
  items: T[];
  setItems: (items: T[]) => void;
  onReorder?: (reorderedItems: T[]) => Promise<void> | void;
}

export const useDragAndDrop = <T,>({
  items,
  setItems,
  onReorder,
}: DragAndDropHook<T>) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<number | null>(null);

  const dragStart = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(index);
    // Add visual feedback to the dragged item
    e.currentTarget.classList.add("opacity-50");
  };

  const dragOver = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverItem(index);
  };

  const dragEnd = (e: React.DragEvent<HTMLElement>) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newItems = [...items];
    const [removed] = newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, removed);

    setItems(newItems);
    setDraggedItem(null);
    setDraggedOverItem(null);

    if (onReorder) {
      onReorder(newItems);
    }
  };

  return {
    dragStart,
    dragOver,
    dragEnd,
    handleDrop,
    draggedItem,
    draggedOverItem,
  };
};