// Create a nextjs get API route to fetch tasks from Close.io
import { NextResponse } from 'next/server'

export async function GET(req) {

  const fullData = []
  let hasMore = true
  let offset = 0
  let limit = 100

  while (hasMore) {
    const taskReq = await fetch(`https://api.close.com/api/v1/task?view=inbox&_skip=${offset}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(process.env.CLOSE_API_KEY)}`
      }
    });
    const tasks = await taskReq.json();
    fullData.push(...tasks.data);
    offset += limit;
    hasMore = tasks.has_more;
  }

  const tasksDueByUser = {}

  fullData.forEach(task => {
    const userName = task.assigned_to_name
    if (!tasksDueByUser[userName]) {
      tasksDueByUser[userName] = 0;
    }
    tasksDueByUser[userName]++;
  });

  return NextResponse.json({ tasks: fullData, tasksDueByUser });
}
