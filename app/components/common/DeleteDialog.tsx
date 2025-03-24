import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";

interface DeleteDialogProps {
  /** The item name or description to delete */
  itemName: string;
  /** Function to execute when the delete action is confirmed */
  onDelete: () => Promise<void> | void;
  /** Function to close the dialog */
  onClose: () => void;
  /** Controls the visibility of the dialog */
  isOpen: boolean;
  /** Loading state of the delete operation */
  isLoading?: boolean;
  /** Optional: Custom delete button text */
  deleteButtonText?: string;
  /** Optional: Custom cancel button text */
  cancelButtonText?: string;
  /** Optional: Custom dialog title */
  title?: string;
  /** Optional: Custom dialog description */
  description?: string;
}

export function DeleteDialog({
  itemName,
  isOpen = false,
  isLoading = false,
  onDelete,
  onClose,
  deleteButtonText = "Delete",
  cancelButtonText = "Cancel",
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete",
}: DeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await onDelete();
    } catch (error) {
      // Error handling is expected to be done in the parent component
      // We just need to ensure the dialog doesn't close on error
      return;
    }
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}{" "}
            <span className="font-semibold text-foreground">{itemName}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelButtonText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              deleteButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}