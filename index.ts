const pad = (num: number) => num.toString().padStart(2, '0')

const makePart = (id: number, value: string) => pad(id) + pad(value.length) + value

const crcChecksum = (str: string) => {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
    }
  }
  crc &= 0xFFFF
  return crc.toString(16).padStart(4, "0").toUpperCase()
}

const makeMerchantInfo = (bankId: string, accountNumber: string, isCard?: boolean) => {
  const bankIdPart = makePart(0, bankId)
  const accountNumberPart = makePart(1, accountNumber)
  const merchantInfo = makePart(1, bankIdPart + accountNumberPart)
  const merchantPrefix = makePart(0, 'A000000727')    // always A000000727
  const serviceCode = makePart(2, isCard ? 'QRIBFTTC' : 'QRIBFTTA')
  return merchantPrefix + merchantInfo + serviceCode
}

export type QRInfo = {
  isDynamic?: boolean
  bankId: string
  accountNumber: string
  isCard?: boolean
  amount?: number
  billNumber?: string
  description?: string
}

export const makeQRData = (info: QRInfo) => {
  let qrData = ''
  // Payload format indicator
  qrData += makePart(0, '01')    // always 01
  // Point of initiation method
  qrData += makePart(1, info.isDynamic ? '12' : '11')
  // Merchant account information
  qrData += makePart(38, makeMerchantInfo(info.bankId, info.accountNumber, info.isCard))
  // Transaction currency
  qrData += makePart(53, '704')    // 704: VND
  // Transaction amount
  if (info.amount) {
    qrData += makePart(54, info.amount.toString())
  }
  // Country code
  qrData += makePart(58, 'VN')     // VN: Vietnam
  // Additional data field
  let additionalData = ''
  if (info.billNumber) {
    additionalData += makePart(1, info.billNumber)
  }
  if (info.description) {
    additionalData += makePart(8, info.description)
  }
  if (additionalData) {
    qrData += makePart(62, additionalData)
  }
  // CRC checksum
  qrData += '6304'
  qrData += crcChecksum(qrData)
  return qrData
}
