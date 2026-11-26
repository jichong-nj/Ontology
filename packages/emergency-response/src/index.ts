export { objectTypes, linkTypes } from './definitions';
export { ensureEmergencyOntology, ensureEmergencyAutomations, seedEmergencyDemo } from './bootstrap';
export { functions, actions, rules } from './automations';
export { EmergencyService } from './service';
export type { CaseSummary, GraphNode, GraphEdge } from './service';
export { extractFromText, analyzeCaseText, generateClosureDraftText } from './ai';
