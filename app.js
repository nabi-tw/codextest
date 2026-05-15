const kanaRows = [
  ["a", "i", "u", "e", "o"],
  ["ka", "ki", "ku", "ke", "ko"],
  ["sa", "shi", "su", "se", "so"],
  ["ta", "chi", "tsu", "te", "to"],
  ["na", "ni", "nu", "ne", "no"],
  ["ha", "hi", "fu", "he", "ho"],
  ["ma", "mi", "mu", "me", "mo"],
  ["ya", "", "yu", "", "yo"],
  ["ra", "ri", "ru", "re", "ro"],
  ["wa", "", "", "", "wo"],
  ["n", "", "", "", ""]
];

const hiragana = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", shi: "し", su: "す", se: "せ", so: "そ",
  ta: "た", chi: "ち", tsu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を", n: "ん"
};

const katakana = {
  a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ",
  ka: "カ", ki: "キ", ku: "ク", ke: "ケ", ko: "コ",
  sa: "サ", shi: "シ", su: "ス", se: "セ", so: "ソ",
  ta: "タ", chi: "チ", tsu: "ツ", te: "テ", to: "ト",
  na: "ナ", ni: "ニ", nu: "ヌ", ne: "ネ", no: "ノ",
  ha: "ハ", hi: "ヒ", fu: "フ", he: "ヘ", ho: "ホ",
  ma: "マ", mi: "ミ", mu: "ム", me: "メ", mo: "モ",
  ya: "ヤ", yu: "ユ", yo: "ヨ",
  ra: "ラ", ri: "リ", ru: "ル", re: "レ", ro: "ロ",
  wa: "ワ", wo: "ヲ", n: "ン"
};

const entries = Object.keys(hiragana).map((roma) => ({
  roma,
  hiragana: hiragana[roma],
  katakana: katakana[roma]
}));

function buildTable(tableId, data) {
  const table = document.getElementById(tableId);
  if (!table) return;

  table.innerHTML = "";
  kanaRows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((roma) => {
      const cell = document.createElement("td");
      cell.innerHTML = roma ? `${data[roma]}<br><small>(${roma})</small>` : "";
      tr.appendChild(cell);
    });
    table.appendChild(tr);
  });
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

document.addEventListener("DOMContentLoaded", () => {
  const scriptSelect = document.getElementById("scriptSelect");
  const questionCount = document.getElementById("questionCount");
  const startBtn = document.getElementById("startBtn");
  const quizCard = document.getElementById("quizCard");
  const progress = document.getElementById("progress");
  const kana = document.getElementById("kana");
  const answerForm = document.getElementById("answerForm");
  const answerInput = document.getElementById("answerInput");
  const feedback = document.getElementById("feedback");
  const result = document.getElementById("result");

  if (!scriptSelect || !questionCount || !startBtn || !quizCard || !progress || !kana || !answerForm || !answerInput || !feedback || !result) {
    console.error("初期化エラー: 必要な要素が見つかりません。index.html を確認してください。");
    return;
  }

  let quiz = [];
  let current = 0;
  let score = 0;

  function startQuiz() {
    const mode = scriptSelect.value;
    const count = Number(questionCount.value);

    const pool = entries.flatMap((item) => {
      if (mode === "hiragana") return [{ char: item.hiragana, roma: item.roma }];
      if (mode === "katakana") return [{ char: item.katakana, roma: item.roma }];
      return [
        { char: item.hiragana, roma: item.roma },
        { char: item.katakana, roma: item.roma }
      ];
    });

    quiz = shuffle(pool).slice(0, count);
    current = 0;
    score = 0;
    result.classList.add("hidden");
    quizCard.classList.remove("hidden");
    feedback.textContent = "";
    nextQuestion();
  }

  function nextQuestion() {
    if (current >= quiz.length) {
      finishQuiz();
      return;
    }
    progress.textContent = `問題 ${current + 1} / ${quiz.length}`;
    kana.textContent = quiz[current].char;
    answerInput.value = "";
    answerInput.focus();
  }

  function finishQuiz() {
    quizCard.classList.add("hidden");
    result.classList.remove("hidden");
    result.innerHTML = `<h2>けっか</h2><p>${quiz.length}問中 ${score}問せいかい！</p>`;
  }

  startBtn.addEventListener("click", startQuiz);
  answerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!quiz.length) return;

    const input = answerInput.value.trim().toLowerCase();
    const correct = quiz[current].roma;

    if (input === correct) {
      score += 1;
      feedback.textContent = "✅ せいかい！";
      feedback.style.color = "#0a7a32";
    } else {
      feedback.textContent = `❌ ざんねん。正解は ${correct}`;
      feedback.style.color = "#b00020";
    }

    current += 1;
    setTimeout(nextQuestion, 500);
  });

  buildTable("hiraganaTable", hiragana);
  buildTable("katakanaTable", katakana);
});
