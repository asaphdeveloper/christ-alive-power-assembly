const subscribers = new Map();

export function subscribeToResourceEvents(_req, res) {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write(': connected\n\n');

  const heartbeat = setInterval(() => {
    if (!res.destroyed) res.write(': keep-alive\n\n');
  }, 25_000);
  heartbeat.unref?.();
  subscribers.set(res, heartbeat);

  res.on('close', () => {
    clearInterval(heartbeat);
    subscribers.delete(res);
  });
}

export function broadcastResourceUpdate() {
  const event = 'event: resources-updated\ndata: {}\n\n';
  for (const [res, heartbeat] of subscribers) {
    if (res.destroyed || res.writableEnded) {
      clearInterval(heartbeat);
      subscribers.delete(res);
      continue;
    }
    res.write(event);
  }
}
