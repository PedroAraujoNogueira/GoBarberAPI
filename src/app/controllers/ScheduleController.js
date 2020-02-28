import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointments from '../models/Appointment';
import User from '../models/User';


class ScheduleController {
  async index(req, resp) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId, provider: true,
      },
    });

    if (!checkUserProvider) {
      return resp.status(401).json({ error: 'User is not a provider.' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointments.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return resp.json(appointments);
  }
}

export default new ScheduleController();