;(function () {
  // just place a div at top right
  var images = document.getElementsByTagName('img')
  if (images.length > 0) {
    const imgs = []
    for (let i = 0; i < images.length; i++) {
      imgs.push({ src: images[i].src, alt: images[i].alt })
    }

    chrome.storage.sync.set(
      {
        images: imgs
      },
      function () {
        console.log('Images uploaded!')
      }
    )
  }
  return 'No Images found on page'
})()
