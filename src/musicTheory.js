module.exports.basicChordTypes = ['major', 'minor'];
module.exports.chordTypes = ['major', 'minor'];

module.exports.noteName = function(note) {
  return [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
  ][note % 12];
};

// Can take a note or an array of notes.
module.exports.convertToFlat = function(notes) {
  if (!Array.isArray(notes)) notes = [notes];
  for (var i = 0; i < notes.length; i++) {
    notes[i] = {
      "C": "C",
      "C#": "Db",
      "D": "D",
      "Eb": "Eb",
      "E": "Fb",
      "F": "F",
      "F#": "Gb",
      "G": "G",
      "G#": "Ab",
      "A": "A",
      "A#": "Bb",
      "B": "Cb"
    }[notes[i]];
  }
  return (notes.length > 1 ? notes : notes[0]);
};

module.exports.isFlatKey = function(note, mode) {
  var name = (key).toLowerCase();
  mode = mode || "major";
  if (mode === 'major') {
    return ([1, 3, 5, 8, 10].indexOf(note % 12) !== -1);
  } else if (mode === 'minor') {
    return ([0, 2, 3, 5, 7, 10].indexOf(note % 12) !== -1);
  } else {
    throw mode + " is neither major nor minor";
  }
};

module.exports.convertToRomanNumeral = function(degree, mode) {
  degree = (typeof degree === 'string' ? degree : degree.toString());
  if (mode === 'minor') {
    return {
      '1': 'i',
      '2': "ii",
      '3': 'III',
      '4': 'iv',
      '5': 'v',
      '6': 'VI',
      '7': 'VII'
    }[degree];
  } else { // major.
    return {
      '1': 'I',
      '2': 'ii',
      '3': 'iii',
      '4': 'IV',
      '5': 'V',
      '6': 'vi',
      '7': 'vii'
    }[degree];
  }
};

module.exports.intervalName = function(interval) {
  return [
    "Unity",
    "Minor 2nd",
    "Major 2nd",
    "Minor 3rd",
    "Major 3rd",
    "Perfect 4th",
    "Tritone",
    "Perfect 5th",
    "Minor 6th",
    "Major 6th",
    "Minor 7th",
    "Major 7th",
    "Octave",
    "Minor 9th",
    "Major 9th",
    "Minor 10th",
    "Major 10th"
  ][Math.abs(interval[1] - interval[0])];
};

module.exports.scales = {
  major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24],
  minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24]
};

module.exports.makeInterval = function(root, size) {
  return [root, root + size];
};

module.exports.makeChord = function(root, type, inversion) {

  type = type || "major";
  inversion = inversion || 0;

  var notes = [root];

  if (type === 'major') {
    notes.push(root + 4);
    notes.push(root + 7);
  } else if (type === 'minor') {
    notes.push(root + 3);
    notes.push(root + 7);
  } else if (type === 'diminished') {
    notes.push(root + 3);
    notes.push(root + 6);
  } else if (type === 'augmented') {
    notes.push(root + 4);
    notes.push(root + 8);
  }

  while (inversion-- > 0) {
    notes = notes.slice(1).concat([notes[0] + 12]);
  }

  return notes;
};

module.exports.makeScaleChord = function(root, scaleType, degree, inversion) {

  degree = degree || 1;
  scaleType = scaleType || "major";
  inversion = inversion || 0;

  var scale = this.scales[scaleType],
      notes = [root + scale[degree - 1]];

  notes.push(root + scale[(degree + 1)]);
  notes.push(root + scale[(degree + 3)]);

  while (inversion-- > 0) {
    notes = notes.slice(1).concat([notes[0] + 12]);
  }

  return notes;
};

module.exports.identifyChord = function(input) {
  var possibles,
      notes = [];

  for (var i = 0; i < input.length; i++) {
    var note = input[i] % 12;
    if (notes.indexOf(note) === -1) notes.push(note);
  }


  if (notes.length === 1) {
    return "note";
  }
  else if (notes.length === 2) {
    possibles = ["power"];
  } else if (notes.length === 3) {
    possibles = ['major', 'minor', 'diminished', 'augmented'];
  } else if (notes.length === 4) {
    possibles = ['major seventh', 'seventh', 'minor seventh'];
  }

  // Attempts to find a chord that matches the provided notes.
  // For each note, build the possible chords and see if the
  // notes in those chords match the other provided notes.
  for (var i = 0; i < notes.length; i++) {
    var testRoot = notes[i];
    for (var j = 0; i < possibles.length; i++) {
      var testType = possibles[i];
      var testChord = module.exports.makeChord(testRoot, testType);
      var match = true;
      for (var k = 0; k < testChord.length; k++) {
        if (notes.indexOf(testChord[k] % 12) === -1) match = false;
      }
      if (match) {
        return {root: testRoot, type: testType};
      }
    }
  }

  return null;
};

module.exports.transpose = function(notes, amount) {
  var transposed = [];
  for (var i = 0; i < notes.length; i++) {
    transposed[i] = notes[i] + amount;
  }
  return transposed;
};