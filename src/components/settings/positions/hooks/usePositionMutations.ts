import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Position } from "../types";

export const usePositionMutations = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPositionMutation = useMutation({
    mutationFn: async (positionData: Omit<Position, 'positionid'>) => {
      console.log('Creating position:', positionData);
      const { data, error } = await supabase
        .from('positions')
        .insert([positionData])
        .select()
        .returns<Position[]>()
        .maybeSingle();
      
      if (error) {
        console.error('Error creating position:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to create position');
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Create mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create position. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updatePositionMutation = useMutation({
    mutationFn: async (positionData: Position) => {
      console.log('Updating position:', positionData);
      const { positionid, ...updateData } = positionData;
      
      const { data, error } = await supabase
        .from('positions')
        .update(updateData)
        .eq('positionid', positionid)
        .select()
        .returns<Position[]>()
        .maybeSingle();
      
      if (error) {
        console.error('Error updating position:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Position not found');
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update position. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deletePositionMutation = useMutation({
    mutationFn: async (positionId: number) => {
      console.log('Deleting position:', positionId);
      
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('positionid', positionId);
      
      if (error) {
        console.error('Error deleting position:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete position. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    createPositionMutation,
    updatePositionMutation,
    deletePositionMutation
  };
};