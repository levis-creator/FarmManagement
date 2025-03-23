import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "~/components/ui/dialog"; // Adjust the import path
import { Button } from "~/components/ui/button";

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    onConfirm?: () => void;
    closeBtn?: boolean;
    confirmText?: string;
    cancelText?: string;
};

export function Modal({
    isOpen,
    onClose,
    closeBtn = false,
    title,
    description,
    children,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
}: DialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-green-800">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="text-green-600">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="overflow-y-auto max-h-80">{children}</div>
                <DialogFooter>
                    {closeBtn && (
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="text-green-800 border-green-300 hover:bg-green-50"
                        >
                            {cancelText}
                        </Button>
                    )}
                    {onConfirm && (
                        <Button
                            onClick={onConfirm}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {confirmText}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}