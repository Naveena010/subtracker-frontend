import { CircleAlert, CircleCheck } from 'lucide-react';

export default function Banner({ type = 'error', message }) {
  if (!message) return null;
  const Icon = type === 'ok' ? CircleCheck : CircleAlert;
  return (
    <div className={`banner ${type}`}>
      <Icon />
      <span>{message}</span>
    </div>
  );
}

export function fieldErrorsToText(fieldErrors) {
  if (!fieldErrors) return '';
  return Object.entries(fieldErrors)
    .map(([field, msg]) => `${field}: ${msg}`)
    .join(' — ');
}
