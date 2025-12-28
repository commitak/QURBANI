export async function sendSMS(phone, qurbaniCode) {
  const message = `
Assalamu Alaikum.
Your Qurbani (ID: ${qurbaniCode}) has been completed.
JazakAllahu Khair.

السلام علیکم
آپ کی قربانی (ID: ${qurbaniCode}) مکمل ہو چکی ہے۔
جزاک اللہ خیر

Assalam Alaikum.
Tuhund Qurbani (ID: ${qurbaniCode}) mukammal chukhi.
Shukriya.
- Madrasa
`.trim();

  console.log("SMS SENT TO:", phone);
  console.log(message);

  // Later: integrate Fast2SMS API here
}
