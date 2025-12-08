import { pool } from '../config/db.js';
import cron from 'node-cron';
import { Status } from '../constants/constants.js';

cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');

  try {
    const bookings = await pool.query(`
      SELECT id, vehicle_id FROM bookings WHERE status = $1 AND rent_end_date < NOW()
      `, [Status.active]);
    for (const booking of bookings.rows) {
      const bookingId = booking.id;
      const vehicleId = booking.vehicle_id;

      await pool.query(`
      UPDATE bookings SET status = $1 WHERE id = $2
      `, [Status.returned, bookingId]);

      await pool.query(`
      UPDATE vehicles SET availability_status = $1 WHERE id = $2
      `, [Status.available, vehicleId]);

    }

  } catch (error) {
    console.log("Auto update error: ", error)
  }
});
