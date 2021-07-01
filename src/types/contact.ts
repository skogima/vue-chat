import { EntityType } from "./entityType";

export interface Contact {
  id: number;
  name: string;
  entityType: EntityType;
  chatUsername: string;
};