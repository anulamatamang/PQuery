class PQuery {
  constructor(selector) {
    this.element = document.querySelector(selector);
    console.log('this', this.element);
  }

  getValue() {
    return this.element.value;
  }

  setValue(value) {
    this.element.value = value;
  }

  html(innerhtml) {
    this.element.innerHTML = innerhtml;
  }

  on(eventType, callback) {
    this.element.addEventListener(eventType, callback);
  }

  hide() {
    this.element.preDisplay = this.element.style.display;
    this.element.style.setProperty('display', 'none');
  }

  show() {
    this.element.style.setProperty('display', this.element.preDisplay);
  }

  displayBlock() {
    this.element.style.setProperty('display', 'block');
  }
  displayNone() {
    this.element.style.setProperty('display', 'none');
  }

  toggle() {
    this.element.classList.toggle('hide');
  }

  classList() {
    return this.element.classList;
  }
  clone() {
    return this.element.content.cloneNode(true);
  }
  append(child) {
    this.element.appendChild(child);
  }
}

const $$ = (selector) => {
  return new PQuery(selector);
};

$$.ajax = async (searchURL) => {
  const result = await fetchJsonp(searchURL);
  const response = await result.json();
  return response;
};

const input = $$('.search-header__input');
const searchIcon = $$('.search-header__icon');
const albumsContainer = $$('.albums-container');
const albumTemplate = document.querySelector('#album-item-template');
const searchResultsDisplay = $$('.search-header__results-display');
const count = $$('.count');
const loadingDiv = $$('.search-header__loading-animation-div');

function clearResults() {
  searchResultsDisplay.hide();
  count.html('');
}

searchIcon.on('click', () => {
  console.log('search icon clicked', searchIcon);

  if (input.getValue() === '') {
    alert(`Please enter artist's name`);
  } else {
    clearResults();
    albumsContainer.html('');
    console.log('search icon click', input.getValue());
    fetchAlbums(input.getValue());
  }
  input.setValue('');
});

input.on('keypress', (e) => {
  if (e.key == 'Enter') {
    if (input.getValue() === '') {
      alert(`Please enter artist's name`);
    } else {
      clearResults();
      albumsContainer.html('');
      fetchAlbums(input.getValue());
    }
    input.setValue('');
  }
});

function renderAlbum(item) {
  const templateClone = albumTemplate.content.cloneNode(true);
  const albumCard = templateClone.querySelector('.album-card');
  const albumImg = templateClone.querySelector('.album-img');
  albumImg.src = item.artworkUrl100;
  const artistName = templateClone.querySelector('.artist-name');
  artistName.innerText = item.artistName;
  const albumName = templateClone.querySelector('.album-name');
  albumName.innerText = item.collectionName;
  const albumGenre = templateClone.querySelector('.album-genre');
  albumGenre.innerText = item.primaryGenreName;
  const trackCount = templateClone.querySelector('.track-count');
  trackCount.innerText = item.trackCount;
  const albumCopyRight = templateClone.querySelector('.album-copyright');
  albumCopyRight.innerText = item.copyright;
  albumsContainer.append(templateClone);
}

function fetchAlbums(ARTIST_NAME) {
  //   loadingDiv.show();
  loadingDiv.displayBlock();

  const searchURL = `https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200`;

  $$.ajax(searchURL).then((data) => {
    console.log(data);
    console.log(data.results);

    data.results.forEach((albumItem) => {
      renderAlbum(albumItem);
    });

    // loadingDiv.hide();
    loadingDiv.displayNone();
    // searchResultsDisplay.show();
    searchResultsDisplay.displayBlock();
    count.html(data.resultCount);
    // console.log('loading div', loadingDiv);
    // console.log('searh results classList', searchResultsDisplay);
  });
}
