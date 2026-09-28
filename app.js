const experienceInput = document.querySelector('#experience');
const charCount = document.querySelector('#char-count');
const generateButton = document.querySelector('#generate-button');
const formMessage = document.querySelector('#form-message');
const results = document.querySelector('#results');

const cleanText = (text) => text.replace(/\s+/g, ' ').trim();

function compactStory(text) {
  const sentence = cleanText(text).split(/[。！？!?]/)[0] || cleanText(text);
  return sentence.length > 46 ? `${sentence.slice(0, 46)}…` : sentence;
}

function createContent(story, type) {
  const core = compactStory(story);
  const typeCopy = {
    '短视频口播': '这段话特别适合正对镜头，像和朋友聊天一样讲出来。',
    '图文笔记': '把这段经历配上 3～5 张真实照片，会比精修图片更有共鸣。',
    '朋友圈文案': '发出前保留一个最真实的小细节，朋友会更愿意停下来读。',
    '直播分享': '直播时先抛出这个问题，再慢慢讲发生了什么。'
  };

  return {
    hook: `我想把这句话送给正在经历类似时刻的你：${core}`,
    script: `以前我总觉得，很多事要准备好了才能开始。直到后来发生了这件事：${core}。\n\n那段时间我也会犹豫，也会担心自己是不是做错了。但走着走着我才明白，答案不是等来的，而是在一次次尝试里慢慢长出来的。\n\n如果你现在也卡在一个选择里，别急着否定自己。先往前走一小步，你会看见不一样的风景。`,
    titles: [
      `关于“${core}”，我想说几句真心话`,
      '原来，人真的会在某个瞬间和自己和解',
      '如果你最近也很迷茫，希望这段经历能陪陪你'
    ],
    advice: `内容类型：${type}。开头 3 秒直视镜头说出第一句；中间穿插与你经历相关的日常画面；结尾停顿一秒再说“你也有过这样的时刻吗？”。${typeCopy[type]}`
  };
}

function setText(id, text) {
  document.querySelector(`#${id}`).textContent = text;
}

function renderContent(content) {
  setText('hook', content.hook);
  setText('script', content.script);
  setText('advice', content.advice);
  const list = document.querySelector('#titles');
  list.replaceChildren(...content.titles.map((title) => {
    const item = document.createElement('li');
    item.textContent = title;
    return item;
  }));
  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

generateButton.addEventListener('click', () => {
  const story = cleanText(experienceInput.value);
  if (story.length < 8) {
    formMessage.textContent = '再多写一点吧，至少用一句话说说你的经历或想法。';
    experienceInput.focus();
    return;
  }
  formMessage.textContent = '';
  const selectedType = document.querySelector('input[name="content-type"]:checked').value;
  generateButton.disabled = true;
  generateButton.querySelector('span').textContent = '正在整理…';
  window.setTimeout(() => {
    renderContent(createContent(story, selectedType));
    generateButton.disabled = false;
    generateButton.querySelector('span').textContent = '生成内容';
  }, 320);
});

experienceInput.addEventListener('input', () => {
  charCount.textContent = `${experienceInput.value.length} / 600`;
  formMessage.textContent = '';
});

document.addEventListener('click', async (event) => {
  const button = event.target.closest('.copy-button');
  if (!button) return;
  const target = document.querySelector(`#${button.dataset.copy}`);
  const text = target.tagName === 'UL'
    ? [...target.querySelectorAll('li')].map((item) => item.textContent).join('\n')
    : target.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement('textarea');
    helper.value = text;
    document.body.append(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }
  const original = button.textContent;
  button.textContent = '已复制 ✓';
  window.setTimeout(() => { button.textContent = original; }, 1600);
});
