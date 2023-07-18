"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs = require("fs");
var cheerio = require("cheerio");
var child_process = require("child_process");
function gitAddCommitPush(date, filename) {
    var cmdGitAdd = "git add ".concat(filename);
    var cmdGitCommit = "git commit -m \"".concat(date, "\"");
    var cmdGitPush = 'git push -u origin master';
    child_process.execSync(cmdGitAdd);
    child_process.execSync(cmdGitCommit);
    child_process.execSync(cmdGitPush);
}
function createMarkdown(date, filename) {
    fs.writeFileSync(filename, "## ".concat(date, "\n"));
}
function updateREADME(date) {
    var content = fs.readFileSync('README.md', 'utf8');
    var index = content.indexOf('# 日期如下');
    var daysParts = content.substring(index);
    var headParts = content.substring(0, index);
    var newContent = [headParts, daysParts.replace('# 日期如下\n\n', "# \u65E5\u671F\u5982\u4E0B\n\n[".concat(date, "](https://github.com/CharlieLau/github-trending/blob/master/days/").concat(date, ".md)\n"))].join('\n');
    fs.writeFileSync('README.md', newContent, 'utf8');
}
function scrape(language, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, url, response, $, items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:11.0) Gecko/20100101 Firefox/11.0',
                        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Encoding': 'gzip,deflate,sdch',
                        'Accept-Language': 'zh-CN,zh;q=0.8',
                    };
                    url = "https://github.com/trending/".concat(language);
                    return [4 /*yield*/, axios_1.default.get(url, { headers: headers })];
                case 1:
                    response = _a.sent();
                    $ = cheerio.load(response.data);
                    items = $('div.Box article.Box-row');
                    fs.appendFileSync(filename, "\n#### ".concat(language, "\n"), 'utf-8');
                    items.each(function (_, item) {
                        var title = $(item).find('.lh-condensed a').text().replace(/\s+/g, '').replace(/\n+/g, '').trim();
                        var description = $(item).find('p.col-9').text().replace(/\s+/g, ' ').replace(/\n+/g, '').trim();
                        var url = "https://github.com".concat($(item).find('.lh-condensed a').attr('href'));
                        fs.appendFileSync(filename, "* [".concat(title, "](").concat(url, "): ").concat(description, "\n"), 'utf-8');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function job() {
    return __awaiter(this, void 0, void 0, function () {
        var strDate, filename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    strDate = new Date().toISOString().slice(0, 10);
                    filename = "days/".concat(strDate, ".md");
                    createMarkdown(strDate, filename);
                    return [4 /*yield*/, scrape('javascript', filename)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, scrape('html', filename)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, scrape('css', filename)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, scrape('python', filename)];
                case 4:
                    _a.sent();
                    gitAddCommitPush(strDate, filename);
                    return [4 /*yield*/, updateREADME(strDate)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
job();
