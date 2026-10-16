const { RubyMarshal, RubyObject } = require('./ruby_marshal.js');

// Mock an authentic VX Ace Save file structure
const system = new RubyObject('Game_System', { '@timer': 0, '@save_count': 1 });
const party = new RubyObject('Game_Party', {
  '@gold': 99999,
  '@items': { '1': 5, '12': 10 },
  '@weapons': { '3': 1 },
  '@armors': { '4': 2 }
});

const actor1 = new RubyObject('Game_Actor', {
  '@actor_id': 1,
  '@name': 'Alice',
  '@level': 15,
  '@hp': 850,
  '@mp': 300,
  '@maxhp': 1200,
  '@atk': 95,
  '@def': 70,
  '@lust': 45,
  '@stamina': 100
});

const actors = new RubyObject('Game_Actors', {
  '@data': [null, actor1]
});

const vars = new RubyObject('Game_Variables', {
  '@data': [null, 1, 0, 50, 99]
});

const switches = new RubyObject('Game_Switches', {
  '@data': [null, true, false, true]
});

const saveRoot = [
  system,   // 0
  {},       // 1
  {},       // 2
  {},       // 3
  party,    // 4
  {},       // 5
  {},       // 6
  {},       // 7
  vars,     // 8
  switches, // 9
  actors    // 10
];

const encoded = RubyMarshal.encode(saveRoot);
console.log('Generated VX Ace Save mock, size:', encoded.length);

const decoded = RubyMarshal.decode(encoded);
console.log('Party Gold decoded:', decoded[4]['@gold']);
console.log('Actor 1 Name:', decoded[10]['@data'][1]['@name']);
console.log('Actor 1 Custom @lust:', decoded[10]['@data'][1]['@lust']);
console.log('Variable 4:', decoded[8]['@data'][4]);
console.log('Switch 1:', decoded[9]['@data'][1]);
