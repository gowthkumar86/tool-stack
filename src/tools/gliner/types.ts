export interface ExtractedEntity {
  text: string;
  label: string;
  score?: number;
  start?: number;
  end?: number;
}

export interface UseCaseDefinition {
  key: string;
  name: string;
  description: string;
  labels: string[];
}

export type GroupedEntities = Record<string, unknown>;

export interface CustomExtractionResponse {
  entities: ExtractedEntity[];
}

export interface ConfiguredExtractionResponse {
  use_case?: string;
  entities: ExtractedEntity[];
  grouped_entities?: GroupedEntities;
}
