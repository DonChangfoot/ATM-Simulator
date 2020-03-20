const IsoParser = require('iso_8583')

function pad (value: string, length: number, char: string) {
  if (value.length >= length) {
    return value.substring(0, length)
  }

  const diff = length - value.length
  let padding = ''

  for (let i = 0; i < diff; i++) {
    padding += char
  }

  return padding + value
}

function generateField7 (): string {
  const now = new Date(Date.now())
  const month = (now.getUTCMonth() + 1).toString()
  const day = now.getUTCDate().toString()
  const minutes = now.getUTCMinutes().toString()
  const hours = now.getUTCHours().toString()
  const seconds = now.getUTCSeconds().toString()

  return pad(month, 2, '0') + pad(day, 2, '0') + pad(hours, 2, '0') + pad(minutes, 2, '0') + pad(seconds, 2, '0')
}

export function createIso0100Message (MSISDN: string, amount: string) {

  const field4 = pad(amount, 12, '0')

  const ISO0100 = {
    0: '0100',
    3: '012000',
    2: '5959590000000042',
    4: field4,
    7: generateField7(),
    11: '000001',
    12: '124845',
    13: '0328',
    15: '0328',
    18: '0780',
    22: '000',
    25: '00',
    28: 'D00000200',
    30: 'C00000000',
    32: '00000000000',
    33: '00000000000',
    37: '000000000010',
    40: '000',
    41: '00000003',
    42: '000000000000001',
    43: 'koratty                thrissur     keIN',
    49: '356',
    56: '1510',
    59: '0000000010',
    100: '484848',
    102: MSISDN, // Mobile number/Account Number
    123: '211201213144001', // Last two digits is custom code to say it is from ATM. 01 will be used for POS.
    127.2: '000319562' // Postillion switchKey
  }

  const isopack = new IsoParser(ISO0100)
  const bufferMessage = isopack.getBufferMessage()

  return bufferMessage
}

export function createIso0200Message (otp: string) {

  const ISO0200 = {
    0: '0200',
    2: '19562964394000003',
    3: '010000',
    4: '000000020000',
    5: '100000000000',
    7: generateField7(),
    9: '12345678',
    11: '000002',
    12: '151154',
    13: '0201',
    16: '1115',
    18: '6011',
    22: '901',
    25: '00',
    26: '31',
    29: 'C00000000',
    41: '00000003',
    42: '000000000000001',
    43: 'Giraffe Road 19 Monument Park       GPZA',
    49: '840',
    50: '840',
    52: '4134363833363944',
    53: '313030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030',
    54: '0040356C000000100000',
    59: 'B92BEEC8-9723-4756-800D-C744B5A',
    102: '19562964394',
    103: otp,
    123: '211201213144002',
    127.2: '000319562'
  }

  const isopack = new IsoParser(ISO0200)
  const bufferMessage = isopack.getBufferMessage()

  return bufferMessage
}

export function createIso0420Message (originalMti: string) {
  if (originalMti.length !== 4) {
    throw new Error('mti needs to be length 4.')
  }
  const field7 = generateField7()
  const ISO0420 = {
    0: '0420',
    2: '44482789624500003',
    3: '390000',
    4: '000000010000',
    7: field7,
    11: '000002',
    12: '103636',
    13: '0130',
    14: '2010',
    15: '0328',
    18: '0780',
    22: '000',
    25: '00',
    28: 'C00000100',
    30: 'C00000000',
    37: '000000000010',
    39: '68',
    40: '010',
    41: '00000003',
    42: '000000000000001',
    49: '840',
    56: '4021',
    59: '0000014491',
    90: `${originalMti}000002${field7}0000000000000000000000`,
    95: '000000000000000000000000C00000000C00000000',
    100: '484848',
    102: '444827896245',
    123: '000011000010001',
    127.2: '0000014491'
  }

  const isopack = new IsoParser(ISO0420)
  const bufferMessage = isopack.getBufferMessage()

  return bufferMessage
}
