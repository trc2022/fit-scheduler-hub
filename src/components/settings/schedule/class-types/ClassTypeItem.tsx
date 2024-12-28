import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClassType, UpdateClassTypeData } from "@/types/schedule/class-types";
import { Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClassTypeForm from "./ClassTypeForm";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ClassTypeItemProps {
  classType: ClassType;
  onUpdate: (id: number, data: UpdateClassTypeData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ClassTypeItem = ({ classType, onUpdate, onDelete }: ClassTypeItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(classType.schedule_type_id);
      await queryClient.invalidateQueries({ queryKey: ['classTypes'] });
      toast({
        title: "Success",
        description: `${classType.name} has been permanently deleted.`,
      });
    } catch (error) {
      console.error('Error deleting class type:', error);
      toast({
        title: "Error",
        description: "Failed to delete class type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 bg-fitness-inner rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-fitness-text font-medium">{classType.name}</h4>
          <p className="text-fitness-text/70 text-sm mt-1">
            {classType.duration} min duration
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4 text-[#15e7fb]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-fitness-card max-h-[90vh] w-[calc(100%+100px)] max-w-[calc(32rem+100px)]">
              <DialogHeader>
                <DialogTitle className="text-fitness-text">Edit Schedule Type</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)] pr-4" style={{
                '--scrollbar-thumb': '#15e7fb',
                '--scrollbar-track': 'transparent'
              } as React.CSSProperties}>
                <ClassTypeForm
                  classType={classType}
                  onSubmit={async (data) => {
                    await onUpdate(classType.schedule_type_id, data);
                    setIsEditOpen(false);
                  }}
                  onCancel={() => setIsEditOpen(false)}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 text-fitness-danger" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-fitness-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-fitness-text">Delete Class Type</AlertDialogTitle>
                <AlertDialogDescription className="text-fitness-text/70">
                  Are you sure you want to delete {classType.name}? This action removes the class type permanently and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#15e7fb] text-fitness-text hover:bg-[#15e7fb]/10">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-fitness-danger hover:bg-fitness-danger/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ClassTypeItem;