const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const questionElement = document.getElementById('question');
const questionText = document.getElementById('questionText');
const questionImage = document.getElementById('questionImage');
const choicesElement = document.getElementById('choices');
const turnIndicator = document.getElementById('turnIndicator');
const currentPlayerElement = document.getElementById('currentPlayer');
let oTurn;
let currentCell;
let isQuestionActive = false;

// sound effects
const correctSound = new Audio('ding-sound-effect_1.mp3'); 
const wrongSound = new Audio(''); 
const winSound = new Audio('audience-clapping-sound-effect_512cqRc.mp3');

const questions = [
  {
    question: "Manakah yang Bukan undang-undang yang wujud di Negeri Melayu?",
    choices: ["Hukum Kanun Pahang", "Undang-undang 99 Perak", "Peraturan Melaka", "Undang-undang Johor"],
    answer: "Peraturan Melaka"
  },
  {
    question: "Bilakah penggubalan Perlembagaan Persekutuan bermula?",
    choices: ["pada tahun 1957 hingga tahun 1963", "pada tahun 1990 hingga tahun 2007", "pada tahun 1877 hingga tahun 1957", "pada tahun 1879 hingga tahun 1945"],
    answer: "pada tahun 1877 hingga tahun 1957"
  },
  {
    question: "Berikut adalah terbitan akhbar dan majalah oleh kaum muda KECUALI",
    choices: ["Neracha", "Al-imam", "Al-ghaniy", "Tunas Melayu"],
    answer: "Al-ghaniy"
  },
  {
    question: "Mengapakah kerajaan kesultanan Melayu Melaka mewujudkan jawatan laksamana ?",
    choices: ["Melicinkan urusan cukai di pelabuhan", "Mengetuai angkatan tentera", "Mengawal keamanan dalam negeri", "Menjaga keselamatan di laut"],
    answer: "Menjaga keselamatan di laut"
  },
  {
    question: "Apakah bidang kuasa Majlis Raja-Raja dalam Pelembagaan Persekutuan?",
    choices: ["Mengisytiharkan darurat", "Menjalankan pilihan raya", "Meluncutkan kewarganegaraan", "Memilih Yang di-Pertuan Agong"],
    answer: "Memilih Yang di-Pertuan Agong"
  },
  {
    question: "Mengapakah kerajaan Persekutuan membentuk Jawatankuasa Pilihan Raya",
    choices: ["Meluluskan undang-undang pilihan raya", "Mengkaji tentang pilihan raya", "Menentukan sempadan pilihan raya", "Menjalankan pendaftaran pilihan raya"],
    answer: "Mengkaji tentang pilihan raya"
  },
  {
    question: "Bagaimanakah rakyat kerajaan Srivijaya memebuktikan kesetiaan mereka kepada raja?",
    choices: ["Menjadi tentera", "Membayar cukai", "Meminum air sumpah", "Menjadi hamba abdi"],
    answer: "Meminum air sumpah"
  },
  {
    question: "Apakah kesan Revolusi Perancis yang berlaku pada tahun 1789?",
    choices: ["Penyatuan negeri bangsa", "perlaksanaan sistem cukai", "Pemerintahan beraja berakhir", "Pengenalan sistem demokrasi"],
    answer: "Pemerintahan beraja berakhir"
  },
  {
    question: "Mengapakah British memperkenalkan Enakmen Undang-undang Islam di negara kita pada awal abad ke-20?",
    choices: ["Menghalang kemasukan para ulama", "Mengehadkan pembentukan pertubuhan agama", "Menyekat pengaruh gerakan Pan-Islamisme", "Membendung idea gerakan Islam Timur Tengah"],
    answer: "Membendung idea gerakan Islam Timur Tengah"
  },
  {
    question: "Mengapakah perlaksanaan pertadbiran Tentera British (BMA) di Tanah Melayu mengalami kegagalan",
    choices: ["Ketiadaan sokongan", "Kekurangan tenaga mahir", "Mendapat tentangan penduduk", "kesukaran memulihkan sosioekonomi"],
    answer: "kesukaran memulihkan sosioekonomi"
  },
  {
    question: "Apakah cadangan yang dikemukakan oleh Jawatankuasa Kerja?",
    choices: ["Mengekalkan penguasa barat", "Meningkatkan ekonomi orang Melayu", "Mengetatkan syarat kewarganegaraan", "Memulihkan peranan pemimpin tempatan"],
    answer: "Mengetatkan syarat kewarganegaraan"
  },
  {
    question: "Apakah langkah yang dilaksanakan melalui perlaksanaan Undang-Undang Darurat",
    choices: ["Melonggarkan syarat kerakyatan", "Menawarkan pengampunan", "Melaksanakan rundingan", "Menangkap pemimpin radikal"],
    answer: "Menangkap pemimpin radikal"
  },
  {
    question: "Apakah kepentingan Sistem Ahli kepada penduduk tempatan di Tanah Melayu?",
    choices: ["Menggubal perlembagaan merdeka", "Menentukan syarat kewarganegaraan", "Menetapkan perlaksanaan pilihan raya", "Melatih penduduk tempatan mentadbir"],
    answer: "Melatih penduduk tempatan mentadbir"
  },
  {
    question: "Apakah jawatan Tunku Abdul Rahman dalam kabinet pertama yang dibentuk selepas Pilihan Raya Umum 1955?",
    choices: ["Menteri Besar", "Ketua Menteri", "Pesuruhjaya tinggi", "Perdana Menteri"],
    answer: "Ketua Menteri"
  },
  {
    question: "Apakah kesan penubuhan Majlis Perundangan Persekutuan pada tahun 1955 kepada rakyat tempatan? ",
    choices: ["Mengadakan pilihan raya", "Mengambil alih pentadbiran", "Membentuk negara demokrasi", "Menggubal perlembagaan merdeka"],
    answer: "Mengambil alih pentadbiran"
  },
  {
    question: "Bagaimanakah tokoh berikut menangani kekejaman komunis di Tanah Melayu?",
    choices: ["Melaksanakan darurat", "Membawa masuk tentera luar", "Menganjurkan perjanjian damai", "Membuka perkampungan baru"],
    answer: "Melaksanakan darurat",
    image: "IMG_20240726_051543.jpg"
  },
  {
    question: "Apakah hasrat Parti Kebangsaan Melayu Malaya (PKMM) memperjuangkan kemerdekaan melalui konsep Melayu Raya",
    choices: ["Memelihara status quo", "Mendaulatkan hak rakyat", "Mewujudkan kerjasama kaum", "Membentuk negara demokrasi"],
    answer: "Mendaulatkan hak rakyat"
  },
  {
    question: "Bagaimanakah tokoh berikut mengetepikan Perjanjian Versailles yang telah ditandatangani pada tahun 1919?",
    choices: ["Memperkukuh sistem monarki", "Menyertai kuasa Bersekutu", "Melancarkan gerakan revolusi", "Menduduki wilayah Rhineland"],
    answer: "Menduduki wilayah Rhineland",
    image: "IMG_20240731_021955.jpg"
  },
  {
    question: "Mengapakah institusi kehakiman harus bebas daripada pengaruh politik?",
    choices: ["Memastikan keadilan dapat ditegakkan", "Mengelakkan kelewatan perbicaraan sesuatu kes", "Menentukan kesahihan buktiyang dikemukakan", "Menjamin perbicaraan kes pihak berkepentingan diutamakan"],
    answer: "Memastikan keadilan dapat ditegakkan"
  },
  {
    question: "Majlis Perundangan Negara (MAPEN) ditubuhkan pada Januari 1970.Apakah kesan penubuhan majlis tersebut?",
    choices: ["Membentuk dasar ekonomi Baru", "Menyusun Dasar Pendidikan Kebangsaan", "Merangka Dasar Pembanggunan Nasional", "Mengkaji Dasar Kebudayaan Kebangsaan"],
    answer: "Membentuk dasar ekonomi Baru"
  },
  {
    question: "Gambar berikut ialah Anugerah Langkawi yang diberikan kepada warganegara Malaysia yang memberi komitmen dan sumbangan besar terhadap negara.Apakah bidang yang terlibat ",
    choices: ["Sungai", "Kesihatan", "Alam sekitar", "Rumah kebajikan"],
    answer: "Alam sekitar",
    image: "SGN_08_06_2024_1722879666298.png"
  }
];

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  oTurn = false;
  isQuestionActive = false;
  updateTurnIndicator();
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.textContent = ''; 
    cell.setAttribute('data-index', cell.getAttribute('data-index')); // Reset
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick);
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
  questionElement.style.display = 'none';
  questionImage.style.display = 'none';
}

function handleClick(e) {
  if (isQuestionActive) return;
  
  currentCell = e.target;
  currentCell.removeEventListener('click',handleClick);
  isQuestionActive = true;
  askQuestion();
}

function askQuestion() {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  questionText.innerText = randomQuestion.question;
  choicesElement.innerHTML = '';
  if (randomQuestion.image) {
    questionImage.src = randomQuestion.image;
    questionImage.style.display = 'block';
  } else {
    questionImage.style.display = 'none';
  }
  randomQuestion.choices.forEach(choice => {
    const choiceButton = document.createElement('button');
    choiceButton.innerText = choice;
    choiceButton.classList.add('choice');
    choiceButton.addEventListener('click', () => {
      checkAnswer(choice, randomQuestion.answer);
    });
    choicesElement.appendChild(choiceButton);
  });
  questionElement.style.display = 'block';
}

function checkAnswer(selectedChoice, correctAnswer) {
  if (selectedChoice === correctAnswer) {
    correctSound.play(); 
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(currentCell, currentClass);
    questionElement.style.display = 'none'; 
    if (checkWin(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  } else {
    wrongSound.play(); // Play wrong sound
    alert("Jawapan salah.");
    currentCell.addEventListener('click', handleClick);
    questionElement.style.display = 'none';
    currentCell.addEventListener('click', handleClick, { once: true }); 
    swapTurns();
    setBoardHoverClass();
  }
  isQuestionActive = false;
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass.toUpperCase(); 
}

function swapTurns() {
  oTurn = !oTurn;
  updateTurnIndicator();
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Seri!';
  } else {
    winningMessageTextElement.innerText = `${oTurn ? "O" : "X"} Menang!`;
    winSound.play(); 
  }
  winningMessageElement.classList.add('show');
  questionElement.style.display = 'none'; 
}

function updateTurnIndicator() {
  currentPlayerElement.innerText = oTurn ? "O" : "X";
}