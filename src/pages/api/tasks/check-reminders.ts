import { NextApiRequest, NextApiResponse } from 'next';
import { checkAndSendReminders } from '../../../services/taskReminderService';

const API_SECRET = process.env.CRON_API_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secret } = req.query;

  if (secret !== API_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await checkAndSendReminders();
    res.status(200).json({ message: 'Reminders checked and sent successfully' });
  } catch (error) {
    console.error('Error in check-reminders:', error);
    res.status(500).json({ message: 'Error checking reminders' });
  }
}