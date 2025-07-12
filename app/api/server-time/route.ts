import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const serverTime = new Date();
    const serverTimezone = 'Asia/Makassar';
    
    // Format waktu dalam timezone server
    const formattedTime = serverTime.toLocaleString('en-US', {
      timeZone: serverTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    return NextResponse.json({
      timestamp: serverTime.getTime(),
      iso: serverTime.toISOString(),
      timezone: serverTimezone,
      formatted: formattedTime,
      date: serverTime.toLocaleDateString('id-ID', { timeZone: serverTimezone }),
      time: serverTime.toLocaleTimeString('id-ID', { timeZone: serverTimezone })
    });
  } catch (error) {
    console.error('Error getting server time:', error);
    return NextResponse.json(
      { error: 'Failed to get server time' },
      { status: 500 }
    );
  }
}