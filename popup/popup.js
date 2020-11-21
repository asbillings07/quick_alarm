;(function () {
  const setAlert = document.getElementById('alert')
  const clearAlert = document.getElementById('clearAlert')
  const anchor = document.getElementById('anchor')
  let alertDelay
  let soundUrl
  let notifInfo
  let internalTimer
  let soundOn = true

  getItem('alertTime', function (data) {
    alertDelay = +data.alertTime
    setAlert.value = alertDelay
    setAlert.textContent = `Start ${alertDelay} min timer`
    clearAlert.textContent = 'Clear timer'
  })

  getItem('alertSound', ({ alertSound }) => {
    soundUrl = alertSound.url
  })

  getItem('notif', ({ notif }) => {
    notifInfo = notif
  })

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // chrome.tabs.executeScript(tabs[0].id, {
    //   file: 'getImages.js'
    // })
  })

  // const alertSound1 = new Audio(chrome.extension.getURL('../music/alert1.mp3'))
  // const alertSound2 = new Audio(chrome.extension.getURL('../music/alert2.mp3'))
  // const alertSound3 = new Audio(chrome.extension.getURL('../music/alert3.mp3'))

  setAlert.onclick = () => setItem({ isAlarmOn: true })

  clearAlert.onclick = function (e) {
    chrome.alarms.clear('timer', (wasCleared) => {
      console.log('The Timer was cleared!', wasCleared)
      setItem({ isAlarmOn: false })
      setItem({ timerDisplay: 'Timer Cleared' })
    })
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    const oldTimerValue = changes.timerDisplay?.oldValue
    const newTimerValue = changes.timerDisplay?.newValue
    const isDifferent = newTimerValue !== oldTimerValue
    if ('timerDisplay' in changes && isDifferent) {
      document.getElementById('demo').innerHTML = newTimerValue
    }
  })

  function getItem(item, func = (data) => console.log(data)) {
    chrome.storage.sync.get(item, func)
  }
  function setItem(item, func = () => false) {
    chrome.storage.sync.set(item)
  }
})()
