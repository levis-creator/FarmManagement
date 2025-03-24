import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface DeleteDialogProps {
  /** The item name or description to delete */
  itemName: string;
  /** Function to execute when the delete action is confirmed */
  onDelete: () => void;
  /** Optional: Custom trigger (e.g., a button or menu item) */
  trigger?: React.ReactNode;
  /** Optional: Custom delete button text */
  deleteButtonText?: string;
  /** Optional: Custom cancel button text */
  cancelButtonText?: string;
  onClose?:()=>void
  isOpen:boolean;
}

export function DeleteDialog({
  itemName,
  isOpen=false,
  onDelete,
  onClose,
  deleteButtonText = "Delete",
  cancelButtonText = "Cancel",
}: DeleteDialogProps) {

  const handleDelete = () => {
    onDelete(); // Execute the delete action
  };
 

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold">{itemName}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {deleteButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}