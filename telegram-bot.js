export default {
    // @ts-ignore
    async fetch(request, env, ctx) {
  
        const botToken = 'TOKEN_BOT_SHOMA';
  
        const responses = {
            '/start': "سلام یادت ندادن ؟ سرتو انداختی اومدی تو ؟",
            'سلام': "افرین یاد بگیر",
            'خدافظ': "چه زود دیگه این ورا پیدات نشه",
            'چطوری': "خوبم مرسی ولی خیلی فضولی",
            'خوبم': "به من چه",
            'سروش رو میشناسی': "اره امروز منو بیدار کرد ارز ترامپ بخره خیلی عجیب رفتار میکنه انگار خنگه",
            'اسمت چیه': "سینا آقا",
            'میدونی من کیم': "اره تو هیچ گوهی نیستی",
            'بنظرت کسی میتونه پرواز کنه': "توی خواب اره ولی توی فضای واقعی (بیلاخ طلایی)",
            'یه چیزی بهم بگو شوکه شم': "سال 2018 دو سال پیش نیست",
            'اهنگ بده': "https://uupload.ir/view/mohsen_chavoshi_amp_hasan_zirak_-_nazdar_cpo9.mp3/",
        };
  
  
        const url = new URL(request.url);
        const domain = url.hostname;
  
  
        async function postReq(url, fields) {
            const tgFormData = new FormData();
  
            fields.forEach(obj => {
                for (let key in obj) {
                    tgFormData.append(key, obj[key]);
                }
            });
  
            const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/${url}`, {
                method: 'POST',
                body: tgFormData,
            });
  
            return await telegramResponse;
        }
  
  
        if (request.method === 'GET') {
  
            if (url.pathname === '/') {
  
                let warningMessage = '';
                // @ts-ignore
                if (!botToken || botToken === '<bot-token>') {
                    warningMessage += '<p style="color: red;">Warning: botToken is not defined</p>';
                }
  
                const telegramResponse = await postReq("setWebhook", [
                    { "url": `https://${domain}/hook` }
                ]);
                const telegramResult = await telegramResponse.text();
  
                const htmlForm = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>simple telegram bot</title>
                <style>          
                </style>
              </head>
              <body>
              Hello
              ${warningMessage}
              <h2>${telegramResult}</h2>
              </body>
            </html>
            `;
  
                return new Response(htmlForm, {
                    headers: { 'Content-Type': 'text/html' }
                });
  
  
            }
        }
  
        if (request.method === 'POST') {
            if (url.pathname === '/hook') {
                const json = await request.json();
  
                if ('text' in json.message) {
                    const rawText = json.message.text;
                    const chatId = json.message.from.id;
  
                    // Normalize function for multilingual text (including Farsi)
                    const normalize = (text) =>
                        text
                            .trim() // Remove leading/trailing spaces
                            .toLowerCase() // Convert English letters to lowercase
                            .replace(/[ـ،؟؛!,.]/g, '') // Remove Farsi-specific punctuation
                            .replace(/\s+/g, ' '); // Collapse multiple spaces
  
                    let normalizedText;
  
                    // Special handling for commands (e.g., '/start')
                    if (rawText.startsWith('/')) {
                        normalizedText = rawText.trim(); // Keep the command as-is
                    } else {
                        // Normalize Farsi and English inputs
                        normalizedText = normalize(rawText);
                    }
  
                    // Match the normalized input to a response, or use a default
                    const responseText = responses[normalizedText] || " چی میگی ؟" + "\n" + normalizedText + " یعنی چی ؟"; // Default Farsi response
  
                    // Send the response
                    await postReq(`sendMessage`, [
                        { "chat_id": chatId },
                        { "text": responseText },
                    ]);
                }
            }
            return new Response("ok");
        }
  
    }
  }