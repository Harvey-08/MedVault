// utils/slotGenerator.js
const moment = require('moment');

function generateAvailableSlots(timing, bookedSlots) {
    const [startTime, endTime] = timing.split(' - ').map(time => moment(time, 'h:mm A'));
    const slots = [];
    const slotDuration = 30; // Duration of each slot in minutes

    for (let time = startTime.clone(); time.isBefore(endTime); time.add(slotDuration, 'minutes')) {
        const slot = time.format('h:mm A');
        if (!bookedSlots.includes(slot)) {
            slots.push(slot);
        }
    }

    return slots;
}

module.exports = { generateAvailableSlots }; // Export the function
