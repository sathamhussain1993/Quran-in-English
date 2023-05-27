// Fetch the Quran data from the API
fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-talalaitaninewt.json')
  .then(response => response.json())
  .then(data => initializeQuranBook(data.quran))
  .catch(error => console.error('Error:', error));

function initializeQuranBook(quranData) {
  const chapterList = document.getElementById('chapter-list');
  const verseList = document.getElementById('verse-list');
  const searchInput = document.getElementById('search-input');

  const chapters = [];
  // Generate the list of chapters
  quranData.forEach(surah => {
    if (!chapters.includes(surah.chapter)) {
      chapters.push(surah.chapter);
      const chapterItem = document.createElement('li');
      chapterItem.classList.add('chapter-item');
      chapterItem.innerText = `Chapter ${surah.chapter}`;
      chapterItem.addEventListener('click', () => showVerses(surah.chapter));
      chapterList.appendChild(chapterItem);
    }
  });

  function showVerses(chapter) {
    verseList.innerHTML = '';

    // Filter the verses for the selected chapter
    const chapterVerses = quranData.filter(verse => verse.chapter === chapter);

    chapterVerses.forEach(verse => {
      const verseText = document.createElement('p');
      verseText.classList.add('verse-text');
      verseText.innerText = `Chapter ${verse.chapter}, Verse ${verse.verse}: ${verse.text}`;
      verseList.appendChild(verseText);
    });
  }

  // Get the currently active chapter
  function getActiveChapter() {
    const activeChapterItem = chapterList.querySelector('.chapter-item.active');
    return activeChapterItem ? parseInt(activeChapterItem.innerText.slice(8)) : 1;
  }

  // Update the active chapter item
  function updateActiveChapter(chapter) {
    const chapterItems = chapterList.querySelectorAll('.chapter-item');
    chapterItems.forEach(item => {
      item.classList.remove('active');
      if (parseInt(item.innerText.slice(8)) === chapter) {
        item.classList.add('active');
      }
    });
  }

  // Handle the search input change event
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    if (query.trim() !== '') {
      const filteredVerses = quranData.filter(verse => {
        const surahName = `Chapter ${verse.chapter}`;
        const verseText = verse.text.toLowerCase();
        return surahName.includes(query) || verseText.includes(query);
      });

      verseList.innerHTML = '';

      filteredVerses.forEach(verse => {
        const verseText = document.createElement('p');
        verseText.classList.add('verse-text');
        verseText.innerText = `Chapter ${verse.chapter}, Verse ${verse.verse}: ${verse.text}`;
        verseList.appendChild(verseText);
      });
    } else {
      showVerses(getActiveChapter());
    }
  });

  // Initialize the Quran book with the first chapter
  showVerses(1);
  updateActiveChapter(1);
}
