import type { Metadata } from 'next';
import './demo.css';
import DemoApp from './DemoApp';

export const metadata: Metadata = { title: 'Live demo', description: 'Click through Locus AI with sample data: search, Memory Explorer, Team Pulse, agents and the admin console.' };

export default function Demo() { return <DemoApp />; }
