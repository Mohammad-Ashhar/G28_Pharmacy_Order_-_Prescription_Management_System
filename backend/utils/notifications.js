import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log('SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export const sendOrderStatusUpdate = async (phone, orderId, status) => {
  const messages = {
    verified: `Your order ${orderId} has been verified and is being processed.`,
    processing: `Your order ${orderId} is being prepared.`,
    assigned: `Your order ${orderId} has been assigned to a delivery agent.`,
    picked_up: `Your order ${orderId} has been picked up and is on the way!`,
    delivered: `Your order ${orderId} has been delivered. Thank you!`,
    rejected: `Your order ${orderId} could not be processed. Please contact support.`
  };
  
  const message = messages[status] || `Your order ${orderId} status: ${status}`;
  return sendSMS(phone, message);
};

export const sendRefillReminder = async (phone, medicineName) => {
  const message = `Reminder: It's time to refill your prescription for ${medicineName}. Order now on our pharmacy app!`;
  return sendSMS(phone, message);
};
