export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Photo Book Creator Frontend',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}