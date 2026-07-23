import { fetch, ProxyAgent } from 'undici';
import { load } from 'cheerio';
import net from 'node:net';

const Channel = "rsplus_spb";
const PROXY_HOST = '127.0.0.1';
const PROXY_PORT = 10808;

const proxyAgent = new ProxyAgent(`http://${PROXY_HOST}:${PROXY_PORT}`);

function extractUrlFromStyle(style) {
  const match = style.match(/url\((?:'|")?(.*?)(?:'|")?\)/);
  return match ? match[1] : null;
}

function isProxyAlive(host = PROXY_HOST, port = PROXY_PORT, timeout = 300) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

export async function fetchTelegramNews(channel = Channel, limit = 50) {
  const hasProxy = await isProxyAlive();
  
  // Если прокси активен — используем dispatcher, иначе — пустые опции (прямой запрос)
  const fetchOptions = hasProxy ? { dispatcher: proxyAgent } : {};

  try {
    const res = await fetch(`https://t.me/s/${channel}`, fetchOptions);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $ = load(html);

    console.log(res.status, res.statusText, `Proxy active: ${hasProxy}`);

    
    const main = $(`main.tgme_main[data-url="/${channel}"]`);
    if (!main.length) throw new Error("Main content not found");

    const rawPosts = main.find(".tgme_widget_message_bubble").slice(0, limit);
    const posts = [];

    rawPosts.each((_, elem) => {
      const rawPost = $(elem);
      const timeElem = rawPost.find(".tgme_widget_message_info time");
      const textElem = rawPost.find(".tgme_widget_message_text");

      const isoDate = timeElem.attr("datetime") || null;
      const humanTime = timeElem.text() || null;
      const htmlText = textElem.html() || '';
      const parsedDate = isoDate ? new Date(isoDate) : null;
      const formattedDate = parsedDate
        ? new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Europe/Moscow'
          }).format(parsedDate)
        : null;

      const parent = rawPost.parent();
      const post = {
        id: parent.attr("data-post") || null,
        date: isoDate,
        time: humanTime,
        text: htmlText,
        parsedDate,
        formattedDate,
        images: [],
        videos: [],
        type: parent.hasClass("service_message") ? "srvcmsg" : "post",
      };

      if (post.text.startsWith("<b>")) {
        const headlineMatch = post.text.match(/^<b>(.*?)<\/b>/);
        if (headlineMatch) {
          post.headline = headlineMatch[1];
          if (post.headline.length < 100) {
            post.text = post.text.replace(/^<b>.*?<\/b>(<br>)+/, "");
          } else {
            delete post.headline;
          }
        }
      }

      rawPost.find(".tgme_widget_message_photo_wrap").each((_, photo) => {
        const style = $(photo).attr("style") || '';
        const link = extractUrlFromStyle(style);
        if (link) post.images.push(link);
      });

      rawPost.find(".tgme_widget_message_video_wrap").each((_, videoWrap) => {
        const $wrap = $(videoWrap);
        const previewStyle = $wrap.parent().find("i").attr("style") || '';
        const preview = extractUrlFromStyle(previewStyle);
        post.videos.push({
          source: "Telegram",
          video: $wrap.find("video").attr("src") || null,
          time: $wrap.parent().find("time").text() || null,
          preview,
        });
      });

      const ytVideo = rawPost.find(
        `a.tgme_widget_message_link_preview[href*="youtu.be"], a.tgme_widget_message_link_preview[href*="www.youtube.com"]`
      ).first();
      if (ytVideo.length) {
        const previewStyle = ytVideo.find("i").attr("style") || '';
        const preview = extractUrlFromStyle(previewStyle);
        post.videos.push({
          source: "YouTube",
          link: ytVideo.attr("href"),
          headline: ytVideo.find(".link_preview_title").html() || '',
          preview,
        });
      }

      posts.push(post);
    });

    return posts;
    

  } catch (error) {
    console.error(`[Telegram Fetch Error] (Proxy active: ${hasProxy}):`, error.message);
    throw error;
  }
}


// async function fetchTelegramNews(channel, limit = 50) {
//   const dispatcher = await getDispatcher();
//   const fetchOptions = dispatcher ? { dispatcher } : {};
//   const res = await fetch(`https://t.me/s/${channel}`, fetchOptions);
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
//   const html = await res.text();
//   const $ = load(html);

  
// }

/** Lambda / Serverless handler */
// export async function handler(event) {
//   try {
//     const params = event.queryStringParameters || {};
//     const channel = params.channel;
//     const limit = params.limit ? parseInt(params.limit, 10) : 50;

//     if (!channel) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "Parameter 'channel' is required" }),
//       };
//     }

//     const posts = await fetchTelegramNews(channel, limit);

//     return {
//       statusCode: 200,
//       body: JSON.stringify(posts),
//       headers: { "Content-Type": "application/json" },
//     };
//   } catch (err) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message }),
//     };
//   }
// }


export async function GET({ url }) {
  try {
    const params = Object.fromEntries(url.searchParams.entries());
    const limit = params.limit ? parseInt(params.limit, 10) : 50;

    const posts = await fetchTelegramNews(Channel, limit);

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
