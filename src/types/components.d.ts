import { Capabilities } from './capabilities';

export interface Component {
    id: string;
    label: string;
    capabilities: Capabilities[];
}