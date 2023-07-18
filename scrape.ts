import axios from 'axios';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as child_process from 'child_process';



const README_TEMPLATE =`# Daily GitHub Trending

项目简介：每日同步，github 热榜

# 更新如下

[2023-07-18](https://github.com/CharlieLau/github-trending/blob/master/2023-07-18.md)
`


function gitAddCommitPush(date: string, filename: string) {
  const cmdGitAdd = `git add ${filename}`;
  const cmdGitCommit = `git commit -m "${date}"`;
  const cmdGitPush = 'git push -u origin master';

  child_process.execSync(cmdGitAdd);
  child_process.execSync(cmdGitCommit);
  child_process.execSync(cmdGitPush);
}

function createMarkdown(date: string, filename: string) {
  fs.writeFileSync(filename, `## ${date}\n`);
}


function  updateREADME(){


}

async function scrape(language: string, filename: string) {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:11.0) Gecko/20100101 Firefox/11.0',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip,deflate,sdch',
    'Accept-Language': 'zh-CN,zh;q=0.8',
  };

  const url = `https://github.com/trending/${language}`;
  const response = await axios.get(url, { headers });
  const $ = cheerio.load(response.data);
  const items = $('div.Box article.Box-row');

  fs.appendFileSync(filename, `\n#### ${language}\n`, 'utf-8');

  items.each((_, item) => {
    const title = $(item).find('.lh-condensed a').text().replace(/\s+/g, '').replace(/\n+/g,'').trim();
    // const owner = $(item).find('.lh-condensed span.text-normal').text().replace(/\s+/g, '').replace(/\n+/g,'').trim();
    const description = $(item).find('p.col-9').text().replace(/\s+/g, '').replace(/\n+/g,'').trim();
    const url = `https://github.com${$(item).find('.lh-condensed a').attr('href')}`;

    fs.appendFileSync(
      filename,
      `* [${title}](${url}):${description}\n`,
      'utf-8'
    );
  });
}

async function job() {
  const strDate = new Date().toISOString().slice(0, 10);
  const filename = `days/${strDate}.md`;

  createMarkdown(strDate, filename);

  await scrape('javascript', filename);
  await scrape('html', filename);
  await scrape('css', filename);
  await scrape('python', filename);

  gitAddCommitPush(strDate, filename);
}

job();
