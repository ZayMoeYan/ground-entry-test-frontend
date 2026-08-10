import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Ground Data Entry System',
  description: 'Data entry and management dashboard',
};

export default function Home() {
  redirect('/public');
}