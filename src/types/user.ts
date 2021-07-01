import { EntityType } from "./entityType";

export interface User {
  id: number;
  name: string;
  entityType: EntityType;
  chatUsername: string;
};
