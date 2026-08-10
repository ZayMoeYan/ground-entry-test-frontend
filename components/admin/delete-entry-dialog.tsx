'use client';

import { toast } from 'sonner';
import { useDeleteGroundEntry } from '@/hooks/use-ground-entries';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

interface DeleteEntryDialogProps {
    entryId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteEntryDialog({ entryId, open, onOpenChange }: DeleteEntryDialogProps) {
    const deleteMutation = useDeleteGroundEntry();

    const handleDelete = () => {
        if (!entryId) return;

        deleteMutation.mutate(entryId, {
            onSuccess: () => {
                toast.success('Record ကို ဖျက်ပြီးပါပြီ။');
                onOpenChange(false);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || 'Failed to delete the record.');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this record?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}