import { Server } from '@/Server';

try {
  console.log('Starting up the application...');
  const server = new Server(4000);
  server.listen();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(`${error.name}: ${error.message}`);
    console.log('Closing the application...');
    process.exit(1);
  }
}
