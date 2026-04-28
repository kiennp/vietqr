import { makeQRData, QRInfo } from '.'

describe('make qr data', () => {
  const data: Record<string, QRInfo & { code: string }> = {
    'static qr for bank account': {
      bankId: '970403',
      accountNumber: '0011012345678',
      code: '00020101021138570010A00000072701270006970403011300110123456780208QRIBFTTA53037045802VN63049E6F'
    },
    'static qr for card': {
      bankId: '970403',
      accountNumber: '9704031101234567',
      isCard: true,
      code: '00020101021138600010A00000072701300006970403011697040311012345670208QRIBFTTC53037045802VN63044F52'
    },
    'dynamic qr for bank account': {
      isDynamic: true,
      bankId: '970403',
      accountNumber: '0011012345678',
      amount: 180000,
      billNumber: 'NPS6869',
      description: 'thanh toan don hang',
      code: '00020101021238570010A00000072701270006970403011300110123456780208QRIBFTTA530370454061800005802VN62340107NPS68690819thanh toan don hang63042E2E'
    },
    'dynamic qr for card': {
      isDynamic: true,
      bankId: '970403',
      accountNumber: '9704031101234567',
      isCard: true,
      amount: 180000,
      billNumber: 'NPS6869',
      description: 'thanh toan don hang',
      code: '00020101021238600010A00000072701300006970403011697040311012345670208QRIBFTTC530370454061800005802VN62340107NPS68690819thanh toan don hang6304A203'
    },
  }
  for (const [name, info] of Object.entries(data)) {
    it(`generates ${name}`, () => {
      expect(makeQRData(info)).toBe(info.code)
    })
  }
})
