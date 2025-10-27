function TgPosts(channelId, af, ef) {
  // Автор программы: OxideManganese, Версия 0.2.9
  fetch(`https://t.me/s/` + channelId)
    .then(response => {
      if (response.status !== 200) {
        ef(response.status);
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then(pageHtml => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(pageHtml, 'text/html');
      const main = doc.querySelector('main.tgme_main[data-url="/bankmno"]');
      if (!main) throw new Error('Main content not found');
      return main.querySelectorAll('.tgme_widget_message_bubble');
    })
    .then(rawPosts => {
      const posts = [];

      rawPosts.forEach(rawPost => {
        const timeElem = rawPost.querySelector('.tgme_widget_message_info time');
        const textElem = rawPost.querySelector('.tgme_widget_message_text');

        const isoDate = timeElem?.getAttribute('datetime') || null; // машинная дата ISO
        const humanTime = timeElem?.innerHTML || null;             // человекочитаемое время, например "12:11"
        const htmlText = textElem?.innerHTML || '';               // текст сообщения (HTML)

        // parsedDate и formattedDate — дополнительные удобства
        const parsedDate = isoDate ? new Date(isoDate) : null;
        const formattedDate = parsedDate
          ? new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Europe/Moscow'
          }).format(parsedDate)
          : null;

        const post = {
          id: rawPost.parentElement.getAttribute('data-post') || null,
          date: isoDate,         // "2025-09-01T12:11:09+00:00"
          time: humanTime,       // "12:11"
          text: htmlText,        // HTML тела сообщения
          parsedDate,            // JS Date object
          formattedDate,         // Текстовая строка
          images: [],
          videos: [],
          type: rawPost.parentElement.classList.contains('service_message') ? 'srvcmsg' : 'post',
        };

        // Изображения
        rawPost.querySelectorAll('.tgme_widget_message_photo_wrap')?.forEach(a => {
          const rawLin = a.style.backgroundImage || '';
          const link = rawLin.includes('"') ? rawLin.substring(rawLin.indexOf(`"`) + 1, rawLin.lastIndexOf(`"`)) : rawLin;
          if (link) post.images.push(link);
        });

        // Видео (Telegram)
        rawPost.querySelectorAll('.tgme_widget_message_video_wrap')?.forEach(div => {
          const rawImg = div.parentElement.querySelector('i')?.style.backgroundImage || '';
          const preview = rawImg.includes('"') ? rawImg.substring(rawImg.indexOf(`"`) + 1, rawImg.lastIndexOf(`"`)) : rawImg || null;
          post.videos.push({
            source: 'Telegram',
            video: div.querySelector('video')?.src || null,
            time: div.parentElement.querySelector('time')?.innerText || null,
            preview,
          });
        });

        // YouTube-превью (если есть)
        const ytVideo = rawPost.querySelector(
          `a.tgme_widget_message_link_preview[href*="youtu.be"],
           a.tgme_widget_message_link_preview[href*="www.youtube.com"]`
        );
        if (ytVideo) {
          const rawImg = ytVideo.querySelector('i')?.style.backgroundImage || '';
          const preview = rawImg.includes('"') ? rawImg.substring(rawImg.indexOf(`"`) + 1, rawImg.lastIndexOf(`"`)) : rawImg || null;
          post.videos.push({
            source: 'YouTube',
            link: ytVideo.href,
            headline: ytVideo.querySelector('.link_preview_title')?.innerHTML || '',
            preview,
          });
        }

        posts.push(post);
      });

      af(posts);
    })
    .catch(error => ef(error));
}



TgPosts("rsplusspb", console.log)
