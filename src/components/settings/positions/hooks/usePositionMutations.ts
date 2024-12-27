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
        .maybeSingle();
      
      if (error) {
        console.error('Error creating position:', error);
        throw error;
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
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to create position. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updatePositionMutation = useMutation({
    mutationFn: async (positionData: Position) => {
      console.log('Updating position:', positionData);
      const { positionid, ...updateData } = positionData;
      
      // First check if position exists
      const { data: existingPosition, error: checkError } = await supabase
        .from('positions')
        .select()
        .eq('positionid', positionid)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking position:', checkError);
        throw checkError;
      }
      
      if (!existingPosition) {
        throw new Error('Position not found');
      }
      
      const { data, error } = await supabase
        .from('positions')
        .update(updateData)
        .eq('positionid', positionid)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error updating position:', error);
        throw error;
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
    onError: (error) => {
      console.error('Update mutation error:', error);
      const errorMessage = error instanceof Error && error.message === 'Position not found'
        ? "Position not found. It may have been deleted."
        : "Failed to update position. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const deletePositionMutation = useMutation({
    mutationFn: async (positionId: number) => {
      console.log('Deleting position:', positionId);
      
      // First check if position exists
      const { data: existingPosition, error: checkError } = await supabase
        .from('positions')
        .select()
        .eq('positionid', positionId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking position:', checkError);
        throw checkError;
      }
      
      if (!existingPosition) {
        throw new Error('Position not found');
      }
      
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
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      const errorMessage = error instanceof Error && error.message === 'Position not found'
        ? "Position not found. It may have been deleted."
        : "Failed to delete position. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
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