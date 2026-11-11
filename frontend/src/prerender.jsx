import { renderToReadableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

export async function render(path) {
  const stream = await renderToReadableStream(<StaticRouter location={path}><App /></StaticRouter>);
  await stream.allReady;
  return new Response(stream).text();
}
