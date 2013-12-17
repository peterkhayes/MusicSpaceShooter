var mT = require('./musicTheory');
var Instrumental = require('./instrumental');
var events = Object.create(require('events').EventEmitter.prototype);
var _ = require('underscore')

module.exports = function () {
  var player = new Instrumental({
    path: "/audio",
    instruments: {
      'square': [29, 36, 43, 50]
    }
  });

  var song = {
    root: 24,
    mode: 'minor',
    tempo: 140
  };

  var chordProgression = [
    mT.transpose(mT.makeScaleChord(song.root, song.mode, 1, 0), 12),
    mT.makeScaleChord(song.root, song.mode, 6, 1),
    mT.makeScaleChord(song.root, song.mode, 4, 2),
    mT.makeScaleChord(song.root, song.mode, 5, 2)
  ];

  console.log("Chord progression:", chordProgression);

  var step = 0;
  var chordIdx = 0;
  var chordLength = 16;

  var noteToMS = function(type) {
    return 240000 / (song.tempo * type);
  };

  var playNote = _.throttle(function() {
    var chord = chordProgression[chordIdx];
    var note = chord[step % chord.length];
    var length = noteToMS(16);
    player.play('square', note, 3*length/4);
    step++;
    if (step % chordLength === 0) {
      chordIdx = (chordIdx + 1) % chordProgression.length;
    }

    process.on('kill', playNote, length)
  }, 100);
  playNote();
}
