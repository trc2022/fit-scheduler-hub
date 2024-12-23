import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import type { PositionWithPermissions, PermissionSettingsType } from "@/types/permissions";
import { useState } from "react";
import { permissionGroups, getPermissionLabel } from "./utils/permissionUtils";

interface PermissionListProps {
  positions: PositionWithPermissions[];
  onEdit: (position: PositionWithPermissions) => void;
  onDelete: (positionId: number) => void;
  onSave: (positionId: string, permissions: PermissionSettingsType) => void;
  isLoading?: boolean;
}

export const PermissionList = ({ 
  positions, 
  onDelete, 
  onSave,
  isLoading 
}: PermissionListProps) => {
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<PermissionSettingsType | null>(null);

  const handleEdit = (position: PositionWithPermissions) => {
    setEditingPosition(position.positionid.toString());
    setEditingPermissions({...position.access_level});
  };

  const handleCancel = () => {
    setEditingPosition(null);
    setEditingPermissions(null);
  };

  const handleSave = (positionId: string) => {
    if (editingPermissions) {
      onSave(positionId, editingPermissions);
      setEditingPosition(null);
      setEditingPermissions(null);
    }
  };

  const handlePermissionChange = (positionId: string, key: keyof PermissionSettingsType, value: boolean) => {
    const updatedPermissions = editingPermissions ? {
      ...editingPermissions,
      [key]: value,
    } : null;
    
    setEditingPermissions(updatedPermissions);
    
    if (updatedPermissions) {
      // Save immediately when toggling
      onSave(positionId, updatedPermissions);
    }
  };

  const getIndicatorColor = (value: boolean): string => {
    return value ? 'bg-[#00f127]' : 'bg-[#ff0101]';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-fitness-inner p-4 rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {positions?.map((position) => position.access_level && (
        <div key={position.positionid} className="bg-fitness-inner p-6 rounded-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-fitness-text font-medium text-2xl mb-2">{position.positionname}</h4>
              {position.description && (
                <p className="text-sm text-fitness-text/70 mt-1">{position.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              {editingPosition === position.positionid.toString() ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(position.positionid.toString())}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4 text-[#00f127]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(position)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4 text-fitness-text" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(position.positionid)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {Object.entries(permissionGroups).map(([groupName, permissions]) => (
              <div key={groupName} className="space-y-4">
                <h5 className="text-lg font-medium text-fitness-text/90 border-b border-fitness-muted pb-2">{groupName}</h5>
                <div className="space-y-3">
                  {permissions.map((key) => {
                    const isEditing = editingPosition === position.positionid.toString();
                    const permissionValue = isEditing
                      ? editingPermissions?.[key as keyof PermissionSettingsType] ?? false
                      : position.access_level?.[key as keyof PermissionSettingsType] ?? false;

                    return (
                      <div key={key} className="flex items-center justify-between gap-2 p-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className={`w-2 h-2 rounded-full ${getIndicatorColor(permissionValue)}`} 
                          />
                          <span className="text-sm">{getPermissionLabel(key)}</span>
                        </div>
                        {isEditing && (
                          <Switch
                            checked={permissionValue}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(position.positionid.toString(), key as keyof PermissionSettingsType, checked)
                            }
                            className="data-[state=checked]:bg-[#15e7fb]"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};