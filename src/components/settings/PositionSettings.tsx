import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PositionDialog } from "./positions/PositionDialog";
import { usePositionMutations } from "./positions/hooks/usePositionMutations";
import { usePositionsQuery } from "./positions/hooks/usePositionsQuery";
import { PositionList } from "./positions/components/PositionList";
import { useToast } from "@/components/ui/use-toast";

const PositionSettings = () => {
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: positions, error: queryError } = usePositionsQuery();
  const { createPositionMutation, updatePositionMutation, deletePositionMutation } = usePositionMutations(() => {
    setIsDialogOpen(false);
    setSelectedPosition(null);
  });

  const handleSubmit = async (positionData: any) => {
    try {
      if (selectedPosition) {
        await updatePositionMutation.mutateAsync({
          ...positionData,
          positionid: selectedPosition.positionid
        });
      } else {
        await createPositionMutation.mutateAsync(positionData);
      }
    } catch (error: any) {
      console.error('Error handling position:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save position. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (position: any) => {
    if (!position || !position.positionid) {
      toast({
        title: "Error",
        description: "Position not found. It may have been deleted.",
        variant: "destructive"
      });
      return;
    }
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  if (queryError) {
    return (
      <Card className="bg-fitness-card">
        <CardContent className="p-6">
          <p className="text-red-500">Error loading positions. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-fitness-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-fitness-text">Positions & Wages</CardTitle>
        <Button 
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
          onClick={() => {
            setSelectedPosition(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Position
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <PositionList
          positions={positions || []}
          onEdit={handleEdit}
          onDelete={(positionId) => deletePositionMutation.mutate(positionId)}
        />
      </CardContent>

      <PositionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPosition={selectedPosition}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default PositionSettings;