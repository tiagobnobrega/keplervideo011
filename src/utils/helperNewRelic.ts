import NewRelic from 'newrelic-kepler-agent';

export function recordCustomEvent(event: string, data: Record<string, any>) {
  NewRelic.recordCustomEvent(event, data);
}
