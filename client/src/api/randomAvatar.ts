export function getRandomAvatar() {
  const background = [
    '059ff2',
    '71cf62',
    'd84be5',
    'd9915b',
    'f6d594',
    'fcbc34',
  ]
  const eyes = [
    'closed',
    'closed2',
    'crying',
    'cute',
    'glasses',
    'love',
    'pissed',
    'plain',
    'sad',
    'shades',
    'sleepClose',
    'stars',
    'tearDrop',
    'wink',
    'wink2',
  ]

  const mouth = [
    'cute',
    'drip',
    'faceMask',
    'kissHeart',
    'lilSmile',
    'pissed',
    'plain',
    'sad',
    'shout',
    'shy',
    'sick',
    'smileLol',
    'smileTeeth',
    'tongueOut',
    'wideSmile',
  ]

  const currentIDs = [
    background[Math.floor(Math.random() * background.length)],
    eyes[Math.floor(Math.random() * eyes.length)],
    mouth[Math.floor(Math.random() * mouth.length)],
  ]
  const url = 'https://api.dicebear.com/6.x/fun-emoji/'
  const avatarUrl = `${url}svg?backgroundColor=${currentIDs[0]}&eyes=${currentIDs[1]}&mouth=${currentIDs[2]}&size=80`

  return avatarUrl
}
